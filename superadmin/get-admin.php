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

$id = $_GET["id"];

$cacheKey = "db:admin:" . $id;
$data = $redis->get($cacheKey);

if (!$data) {
    $stmt = $conn->prepare("SELECT first_name, last_name, email, phone_number, username, password, created_at FROM users WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();

    $result = $stmt->get_result();
    $res = [
        "success" => true,
        "user" => $result->fetch_assoc()
    ];

    $redis->setex($cacheKey, 600, json_encode($res));

    json_response($res);
} else {
    json_response(json_decode($data, true));
}
