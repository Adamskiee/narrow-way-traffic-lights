<?php
set_exception_handler(function ($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

require_once "../includes/config.php";

$user = get_authenticated_user();
if (!is_verified_logged_in()) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

if (!is_admin_authenticated()) {
    json_response(['success' => false, 'message' => 'Admin access required'], 403);
}

$input = get_json_input();
if (!$input) {
    $input = $_POST;
}

$user_id = $input['user_id'] ?? $user["user_id"];
$camera_id = $input['camera_name'] ?? $input['camera_id'] ?? null;
$light_state = $input['light_color'] ?? $input['light_state'] ?? null;
$mode_type = $input['mode'] ?? $input['mode_type'] ?? null;
$duration_seconds = $input['duration'] ?? $input['duration_seconds'] ?? null;

if (!$camera_id || !$light_state || !$mode_type) {
    json_response(['success' => false, 'message' => 'Missing required fields'], 400);
}

$stmt = $conn->prepare("
    INSERT INTO traffic_logs (user_id, camera_id, light_state, mode_type, duration_seconds) 
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param("isssi", $user_id, $camera_id, $light_state, $mode_type, $duration_seconds);
$stmt->execute();

$log_id = $stmt->insert_id;

if ($log_id) {
    json_response(['success' => true, 'log_id' => $log_id]);
} else {
    json_response(['success' => false, 'message' => 'Failed to create log']);
}
