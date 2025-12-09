<?php
set_exception_handler(function ($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

require_once "../includes/config.php";

if (!is_verified_logged_in()) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

if (!is_admin_authenticated()) {
    json_response(['success' => false, 'message' => 'Admin access required'], 403);
}

// Get filter parameters
$camera_filter = isset($_GET['camera']) ? $_GET['camera'] : '';
$mode_filter = isset($_GET['mode']) ? $_GET['mode'] : '';
$date_from = isset($_GET['date_from']) ? $_GET['date_from'] : '';
$date_to = isset($_GET['date_to']) ? $_GET['date_to'] : '';

// Build WHERE clause for filters
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

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get logs for export
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
    ";

$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

// Set CSV headers
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="traffic_logs_' . date('Y-m-d_H-i-s') . '.csv"');

// Create file pointer connected to the output stream
$output = fopen('php://output', 'w');

// Add CSV headers
$headers = [
    'ID',
    'Camera',
    'Light State',
    'Mode',
    'Duration (seconds)',
    'Timestamp',
    'Username',
    'First Name',
    'Last Name',
    'Email'
];
fputcsv($output, $headers);

// Add data rows
while ($row = $result->fetch_assoc()) {
    $csvRow = [
        $row['id'],
        $row['camera_id'] === 'cam1' ? 'Camera 1' : 'Camera 2',
        ucfirst($row['light_state']),
        ucfirst($row['mode_type']),
        $row['duration_seconds'] ?? 'N/A',
        $row['timestamp'],
        $row['username'] ?? 'Unknown',
        $row['first_name'] ?? '',
        $row['last_name'] ?? '',
        $row['email'] ?? ''
    ];
    fputcsv($output, $csvRow);
}

fclose($output);
