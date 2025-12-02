<?php
require_once "../includes/config.php";

header('Content-Type: application/json');

$user = get_authenticated_user();

if(!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

$cacheKey = 'db:logs-stats';
$data = $redis->get($cacheKey);

$user_id = $user['user_id'];
$admin_id = $user['created_by'];
if(!$data) {
    try {
        $stats = [];
        
        // Total logs count
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM traffic_logs tl LEFT JOIN users u ON tl.user_id = u.id WHERE (u.created_by = ? AND u.role = 'operator') OR tl.user_id = ?");
        $stmt->bind_param("ii", $admin_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats['total_logs'] = $result->fetch_assoc()['total'];
        
        // Auto mode logs count
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM traffic_logs tl LEFT JOIN users u ON tl.user_id = u.id WHERE tl.mode_type = 'auto' AND ((u.created_by = ? AND u.role = 'operator') OR tl.user_id = ?)");
        $stmt->bind_param("ii", $admin_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats['auto_mode_logs'] = $result->fetch_assoc()['total'];
        
        // Manual mode logs count
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM traffic_logs tl LEFT JOIN users u ON tl.user_id = u.id WHERE tl.mode_type = 'manual' AND ((u.created_by = ? AND u.role = 'operator') OR tl.user_id = ?)");
        $stmt->bind_param("ii", $admin_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats['manual_mode_logs'] = $result->fetch_assoc()['total'];
        
        // Today's logs count
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM traffic_logs tl LEFT JOIN users u ON tl.user_id = u.id WHERE DATE(timestamp) = CURDATE() AND ((u.created_by = ? AND u.role = 'operator') OR tl.user_id = ?)");
        $stmt->bind_param("ii", $admin_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats['today_logs'] = $result->fetch_assoc()['total'];
        
        // This week's logs count
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM traffic_logs tl LEFT JOIN users u ON tl.user_id = u.id WHERE YEARWEEK(timestamp) = YEARWEEK(CURDATE()) AND ((u.created_by = ? AND u.role = 'operator') OR tl.user_id = ?)");
        $stmt->bind_param("ii", $admin_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats['week_logs'] = $result->fetch_assoc()['total'];
        
        // Camera usage stats
        $stmt = $conn->prepare("
            SELECT camera_id, COUNT(*) as count 
            FROM traffic_logs tl 
            LEFT JOIN users u ON tl.user_id = u.id 
            WHERE (u.created_by = ? AND u.role = 'operator') OR tl.user_id = ?
            GROUP BY camera_id
        ");
        $stmt->bind_param("ii", $admin_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $camera_stats = [];
        while ($row = $result->fetch_assoc()) {
            $camera_stats[$row['camera_id']] = $row['count'];
        }
        $stats['camera_usage'] = $camera_stats;
        
        // Light state distribution
        $stmt = $conn->prepare("
            SELECT light_state, COUNT(*) as count 
            FROM traffic_logs tl 
            LEFT JOIN users u ON tl.user_id = u.id 
            WHERE (u.created_by = ? AND u.role = 'operator') OR tl.user_id = ?
            GROUP BY light_state
        ");
        $stmt->bind_param("ii", $admin_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $light_stats = [];
        while ($row = $result->fetch_assoc()) {
            $light_stats[$row['light_state']] = $row['count'];
        }
        $stats['light_distribution'] = $light_stats;
        
        // Average duration by mode
        $stmt = $conn->prepare("
            SELECT mode_type, AVG(duration_seconds) as avg_duration 
            FROM traffic_logs tl
            LEFT JOIN users u ON tl.user_id = u.id 
            WHERE duration_seconds IS NOT NULL AND ((u.created_by = ? AND u.role = 'operator') OR tl.user_id = ?)
            GROUP BY mode_type
        ");
        $stmt->bind_param("ii", $admin_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $duration_stats = [];
        while ($row = $result->fetch_assoc()) {
            $duration_stats[$row['mode_type']] = round($row['avg_duration'], 2);
        }
        $stats['average_duration'] = $duration_stats;
        
        // Recent activity (last 7 days)
        $stmt = $conn->prepare("
            SELECT DATE(timestamp) as date, COUNT(*) as count 
            FROM traffic_logs tl
            LEFT JOIN users u ON tl.user_id = u.id 
            WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND ((u.created_by = ? AND u.role = 'operator') OR tl.user_id = ?)
            GROUP BY DATE(timestamp)
            ORDER BY date
        ");
        $stmt->bind_param("ii", $admin_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $activity_stats = [];
        while ($row = $result->fetch_assoc()) {
            $activity_stats[$row['date']] = $row['count'];
        }
        $stats['recent_activity'] = $activity_stats;
        
        $res = json_encode([
            'success' => true,
            'stats' => $stats
        ]);
        
        $redis->setex($cacheKey, 600, $res);
        
        echo $res;
    } catch (Exception $e) {
        error_log("Get stats error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Failed to retrieve statistics: ' . $e->getMessage()
        ]);
    }
}else {
    echo $data;
}
?>