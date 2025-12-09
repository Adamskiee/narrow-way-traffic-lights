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

$cacheKey = "db:ipaddresses";

$input = get_json_input();

$ip_address_1 = $input["ip_address_cam_1"];
$ip_address_2 = $input["ip_address_cam_2"];
$admin_id = $user["user_id"];

$stmt = $conn->prepare(query: "SELECT * from ip_addresses WHERE admin_id = ?");
$stmt->bind_param("i", $admin_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    json_response([
        "success" => false,
        "message" => "IP Address already configured",
        "redirect" => BASE_URL . "/pages/control.php"
    ]);
} else {
    $ins = $conn->prepare("INSERT INTO ip_addresses(ip_address_1, ip_address_2, admin_id) VALUES(?, ?, ?)");
    $ins->bind_param("ssi", $ip_address_1, $ip_address_2, $admin_id);
    $ins->execute();

    $redis->del($cacheKey);

    json_response([
        "success" => true,
        "message" => "IP Addresses successfully inserted",
        "redirect" => BASE_URL . "/pages/control.php"
    ]);
}
