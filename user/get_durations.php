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

$cacheKey = "db:durations";
$data = $redis->get($cacheKey);
if (!$data) {
    $user_id = $user["user_id"];
    if ($user['role'] === 'operator') {
        $stmt = $conn->prepare("SELECT week_day, duration_a, duration_b FROM users u JOIN schedules s ON u.created_by = s.admin_id WHERE u.id = ? GROUP BY s.id");
    } else if ($user["role"] === "admin") {
        $stmt = $conn->prepare("SELECT week_day, duration_a, duration_b FROM schedules WHERE admin_id = ?");
    }
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $schedules = $result->fetch_all(MYSQLI_ASSOC);

    $res = ["success" => true, "schedules" => $schedules];

    $redis->setex($cacheKey, 600, $res);
    json_response($res);
} else {
    json_response($data);
}
