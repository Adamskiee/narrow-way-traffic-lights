<?php
set_exception_handler(function ($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

require_once "../includes/config.php";
header('Content-Type: application/json');

$user = get_authenticated_user();
if (!$user) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

if (!is_admin_authenticated()) {
    json_response(['success' => false, 'message' => 'Admin access required'], 403);
}

try {
    if (isset($_GET['log_id'])) {
        $log_id = intval($_GET['log_id']);

        $sql = "
            SELECT 
                tl.id,
                tl.camera_id,
                CASE 
                    WHEN tl.camera_id = 'cam1' THEN 'Camera 1'
                    WHEN tl.camera_id = 'cam2' THEN 'Camera 2'
                    ELSE tl.camera_id
                END as camera_name,
                tl.light_state,
                tl.mode_type,
                tl.duration_seconds,
                CASE 
                    WHEN tl.duration_seconds IS NOT NULL 
                    THEN CONCAT(FLOOR(tl.duration_seconds / 60), 'm ', (tl.duration_seconds % 60), 's')
                    ELSE 'N/A'
                END as duration_formatted,
                tl.timestamp,
                DATE_FORMAT(tl.timestamp, '%M %d, %Y at %h:%i %p') as created_at_formatted,
                u.username,
                CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) as user_full_name,
                u.email as user_email
            FROM traffic_logs tl
            LEFT JOIN users u ON tl.user_id = u.id
            WHERE tl.id = ? 
        ";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $log_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $log = $result->fetch_assoc();
            json_response([
                'success' => true,
                'logs' => [$log]
            ]);
        } else {
            json_response([
                'success' => false,
                'message' => 'Log not found'
            ]);
        }
        exit;
    }

    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(100, intval(value: $_GET['limit']))) : 20;
    $offset = ($page - 1) * $limit;

    $camera_filter = isset($_GET['camera']) ? $_GET['camera'] : '';
    $mode_filter = isset($_GET['mode']) ? $_GET['mode'] : '';
    $date_from = isset($_GET['date_from']) ? $_GET['date_from'] : '';
    $date_to = isset($_GET['date_to']) ? $_GET['date_to'] : '';

    $where_conditions = [];
    $params = [];
    $types = '';

    if (!empty($camera_filter)) {
        $where_conditions[] = "tl.camera_id = ?";
        $params[] = $camera_filter;
        $types .= 's';
    }

    if (!empty($mode_filter)) {
        $where_conditions[] = "tl.mode_type = ?";
        $params[] = $mode_filter;
        $types .= 's';
    }

    if (!empty($date_from)) {
        $where_conditions[] = "DATE(tl.timestamp) >= ?";
        $params[] = $date_from;
        $types .= 's';
    }

    if (!empty($date_to)) {
        $where_conditions[] = "DATE(tl.timestamp) <= ?";
        $params[] = $date_to;
        $types .= 's';
    }

    $where_conditions[] = "u.created_by = ?";
    $params[] = $user['user_id'];
    $types .= 'i';

    $where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

    $count_sql = "
        SELECT COUNT(*) as total 
        FROM traffic_logs tl 
        LEFT JOIN users u ON tl.user_id = u.id 
        $where_clause
    ";


    $count_stmt = $conn->prepare($count_sql);
    if (!empty($params)) {
        $count_stmt->bind_param($types, ...$params);
    }
    $count_stmt->execute();
    $count_result = $count_stmt->get_result();
    $total_records = $count_result->fetch_assoc()['total'];

    $sql = "
        SELECT 
            tl.id,
            tl.camera_id,
            tl.light_state,
            tl.mode_type,
            tl.duration_seconds,
            tl.timestamp,
            u.username,
            u.first_name,
            u.last_name,
            u.email
        FROM traffic_logs tl
        LEFT JOIN users u ON tl.user_id = u.id
        $where_clause 
        ORDER BY tl.timestamp DESC
        LIMIT ? OFFSET ?
    ";

    $params[] = $limit;
    $params[] = $offset;
    $types .= 'ii';

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $logs = [];
    while ($row = $result->fetch_assoc()) {
        $logs[] = [
            'id' => $row['id'],
            'camera_id' => $row['camera_id'],
            'camera_name' => $row['camera_id'] === 'cam1' ? 'Camera 1' : 'Camera 2',
            'light_state' => ucfirst($row['light_state']),
            'mode_type' => ucfirst($row['mode_type']),
            'duration_seconds' => $row['duration_seconds'],
            'duration_formatted' => $row['duration_seconds'] ? formatDuration($row['duration_seconds']) : 'N/A',
            'created_at' => $row['timestamp'],
            'created_at_formatted' => date('M j, Y g:i A', strtotime($row['timestamp'])),
            'username' => $row['username'] ?? 'Unknown',
            'user_full_name' => trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? '')) ?: 'N/A',
            'user_email' => $row['email'] ?? 'N/A'
        ];
    }

    $total_pages = ceil($total_records / $limit);

    $response = [
        'success' => true,
        'logs' => $logs,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $total_pages,
            'total_records' => $total_records,
            'per_page' => $limit,
            'has_next' => $page < $total_pages,
            'has_prev' => $page > 1
        ],
        'filters' => [
            'camera' => $camera_filter,
            'mode' => $mode_filter,
            'date_from' => $date_from,
            'date_to' => $date_to
        ]
    ];

    json_response($response);
} catch (Exception $e) {
    json_response(['success' => false, 'message' => 'Failed to retrieve logs: ' . $e->getMessage()], 500);
}

/**
 * Format duration seconds into readable format
 * @param int $seconds
 * @return string
 */
function formatDuration($seconds)
{
    if ($seconds < 60) {
        return $seconds . 's';
    } elseif ($seconds < 3600) {
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;
        return $minutes . 'm ' . $remainingSeconds . 's';
    } else {
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $remainingSeconds = $seconds % 60;
        return $hours . 'h ' . $minutes . 'm ' . $remainingSeconds . 's';
    }
}
