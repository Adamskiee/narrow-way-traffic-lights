<?php
set_exception_handler(function ($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

header('Content-Type: application/json');
require_once "../includes/config.php";

$user = get_authenticated_user();
if (!is_verified_logged_in()) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

$cacheKey = "db:ipaddresses";
$data = $redis->get($cacheKey);

if (!$data) {
    $input = get_json_input();
    if ($user['role'] === 'operator') {
        $sel = $conn->prepare("SELECT created_by FROM users WHERE id = ?");
        $sel->bind_param("i", $user["user_id"]);
        $sel->execute();
        $result = $sel->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $admin_id = $row["created_by"];

            $stmt = $conn->prepare("SELECT ip_address_1, ip_address_2 FROM ip_addresses WHERE admin_id = ?");
            $stmt->bind_param("i", $admin_id);
            $stmt->execute();

            $ip_addresses = $stmt->get_result();
            $res = [
                "success" => true,
                "ip_addresses" => $ip_addresses->fetch_assoc()
            ];
            $redis->setex($cacheKey, 600, $res);
            json_response($res);
        } else {
            json_response([
                "success" => false,
                "message" => "Invalid User"
            ]);
        }
    } else if ($user['role'] === 'admin') {
        $stmt = $conn->prepare("SELECT ip_address_1, ip_address_2 FROM ip_addresses WHERE admin_id = ?");
        $stmt->bind_param("i", $user['user_id']);
        $stmt->execute();

        $ip_addresses = $stmt->get_result();
        $res = [
            "success" => true,
            "ip_addresses" => $ip_addresses->fetch_assoc()
        ];
        $redis->setex($cacheKey, 600, $res);

        json_response($res);
    }
} else {
    json_response($data);
}
