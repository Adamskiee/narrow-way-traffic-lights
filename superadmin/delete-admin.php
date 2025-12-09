<?php
set_exception_handler(function ($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

header('Content-Type: application/json');
require_once "../includes/config.php";

if (!is_verified_logged_in()) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

if (!is_super_admin_authenticated()) {
    json_response(['success' => false, 'message' => 'Super admin access required'], 403);
}

$cacheKey = "db:admins";

$input = get_json_input();

$id = $input["admin-id"];

$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$redis->del($cacheKey);
$redis->del("db:admin:" . $id);

json_response([
    "success" => true,
    "message" => "Delete admin successfully"
]);

?>