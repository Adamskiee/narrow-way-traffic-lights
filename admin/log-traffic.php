<?php
require_once "../includes/config.php";

header('Content-Type: application/json');

$user = get_authenticated_user();
if(!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$user_id = $input['user_id'] ?? $user["user_id"];
$camera_id = $input['camera_name'] ?? $input['camera_id'] ?? null;
$light_state = $input['light_color'] ?? $input['light_state'] ?? null;
$mode_type = $input['mode'] ?? $input['mode_type'] ?? null;
$duration_seconds = $input['duration'] ?? $input['duration_seconds'] ?? null;

if (!$camera_id || !$light_state || !$mode_type) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $conn->prepare("
        INSERT INTO traffic_logs (user_id, camera_id, light_state, mode_type, duration_seconds) 
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("isssi", $user_id, $camera_id, $light_state, $mode_type, $duration_seconds);
    
    if ($stmt->execute()) {
        $log_id = $stmt->insert_id;
    } else {
        throw new Exception("Failed to execute statement: " . $stmt->error);
    }
    
} catch (Exception $e) {
    error_log("Traffic log error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    exit;
}

if ($log_id) {
    echo json_encode(['success' => true, 'log_id' => $log_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create log']);
}
?>