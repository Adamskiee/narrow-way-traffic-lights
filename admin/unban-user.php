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

$cacheKey = "db:users";

$input = get_json_input();

$user_id = $input['user-id'];

$stmt = $conn->prepare("UPDATE users SET is_banned = 0 WHERE id = ? AND created_by = ?");
$stmt->bind_param("ii", $user_id, $user['user_id']);
$stmt->execute();

$redis->del($cacheKey);
$redis->del("db:user:" . $user_id);

json_response([
    "success" => true,
    "message" => "Unban successfully"
]);
?>