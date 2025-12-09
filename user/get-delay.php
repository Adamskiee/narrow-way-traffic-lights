<?php
set_exception_handler(function ($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

require_once "../includes/config.php";

header("Content-Type: application/json");

$user = get_authenticated_user();
if (!is_verified_logged_in()) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

$cacheKey = "db:delay";
$data = $redis->get($cacheKey);
if (!$data) {
    $user_id = $user["user_id"];
    if ($user['role'] === 'operator') {
        $stmt = $conn->prepare("SELECT delay FROM users u JOIN delays d ON u.created_by = d.admin_id WHERE u.id = ?");
    } else if ($user['role'] === 'admin') {
        $stmt = $conn->prepare("SELECT delay FROM delays WHERE admin_id = ?");
    }
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $res = ["success" => true, "delay" => $result->fetch_assoc()["delay"]];

    $redis->setex($cacheKey, 600, 
    json_encode($res));
    json_response($res);
} else {
    json_response(json_decode($data, true));
}
