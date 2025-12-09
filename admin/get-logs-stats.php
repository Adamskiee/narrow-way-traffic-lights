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

$cacheKey = 'db:logs-stats';
$data = $redis->get($cacheKey);

$user_id = $user['user_id'];
$admin_id = $user['created_by'];
if (!$data) {
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

    $res = [
        'success' => true,
        'stats' => $stats
    ];

    $redis->setex($cacheKey, 600, $res);

    json_response($res);
} else {
    json_response($data);
}