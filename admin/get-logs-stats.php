<?php
require_once "../includes/config.php";

header('Content-Type: application/json');

if(!is_verified_logged_in()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

$cacheKey = 'db:logs-stats';
$data = $redis->get($cacheKey);

if(!$data) {
    try {
        $stats = [];
        
        // Total logs count
        $result = $conn->query("SELECT COUNT(*) as total FROM traffic_logs");
        $stats['total_logs'] = $result->fetch_assoc()['total'];
        
        // Auto mode logs count
        $result = $conn->query("SELECT COUNT(*) as total FROM traffic_logs WHERE mode_type = 'auto'");
        $stats['auto_mode_logs'] = $result->fetch_assoc()['total'];
        
        // Manual mode logs count
        $result = $conn->query("SELECT COUNT(*) as total FROM traffic_logs WHERE mode_type = 'manual'");
        $stats['manual_mode_logs'] = $result->fetch_assoc()['total'];
        
        // Today's logs count
        $result = $conn->query("SELECT COUNT(*) as total FROM traffic_logs WHERE DATE(timestamp) = CURDATE()");
        $stats['today_logs'] = $result->fetch_assoc()['total'];
        
        // This week's logs count
        $result = $conn->query("SELECT COUNT(*) as total FROM traffic_logs WHERE YEARWEEK(timestamp) = YEARWEEK(CURDATE())");
        $stats['week_logs'] = $result->fetch_assoc()['total'];
        
        // Camera usage stats
        $result = $conn->query("
            SELECT camera_id, COUNT(*) as count 
            FROM traffic_logs 
            GROUP BY camera_id
        ");
        $camera_stats = [];
        while ($row = $result->fetch_assoc()) {
            $camera_stats[$row['camera_id']] = $row['count'];
        }
        $stats['camera_usage'] = $camera_stats;
        
        // Light state distribution
        $result = $conn->query("
            SELECT light_state, COUNT(*) as count 
            FROM traffic_logs 
            GROUP BY light_state
        ");
        $light_stats = [];
        while ($row = $result->fetch_assoc()) {
            $light_stats[$row['light_state']] = $row['count'];
        }
        $stats['light_distribution'] = $light_stats;
        
        // Average duration by mode
        $result = $conn->query("
            SELECT mode_type, AVG(duration_seconds) as avg_duration 
            FROM traffic_logs 
            WHERE duration_seconds IS NOT NULL 
            GROUP BY mode_type
        ");
        $duration_stats = [];
        while ($row = $result->fetch_assoc()) {
            $duration_stats[$row['mode_type']] = round($row['avg_duration'], 2);
        }
        $stats['average_duration'] = $duration_stats;
        
        // Recent activity (last 7 days)
        $result = $conn->query("
            SELECT DATE(timestamp) as date, COUNT(*) as count 
            FROM traffic_logs 
            WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(timestamp)
            ORDER BY date
        ");
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