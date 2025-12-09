<?php
set_exception_handler(function($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

require_once "../includes/config.php";


if(!is_verified_logged_in()) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

if(!is_admin_authenticated()) {
    json_response(['success' => false, 'message' => 'Admin access required'], 403);
}

$input = get_json_input();
$log_id = $input['log_id'] ?? null;

if (!$log_id) {
    json_response(['success' => false, 'message' => 'Log ID is required'], 400);
}

$stmt = $conn->prepare("DELETE FROM traffic_logs WHERE id = ?");
$stmt->bind_param("i", $log_id);

$stmt->execute();
if ($stmt->affected_rows > 0) {
    json_response(['success' => true, 'message' => 'Log deleted successfully']);
} else {
    json_response(['success' => false, 'message' => 'Log not found']);
}

?>