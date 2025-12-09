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
$data = $redis->get($cacheKey);

if (!$data) {
    $stmt = $conn->prepare("SELECT id, username, email, first_name, last_name, created_at, phone_number, is_active, is_2fa_enabled, is_banned FROM users WHERE created_by = ? AND id != ?");
    $stmt->bind_param("ii", $user["user_id"], $user["user_id"]);
    $stmt->execute();

    $result = $stmt->get_result();

    $users = $result->fetch_all(MYSQLI_ASSOC);

    $res = ["success" => true, "users" => $users];

    $redis->setex($cacheKey, 600, json_encode($res));

    json_response($res);
} else {
    json_response(json_decode($data, true));
}
