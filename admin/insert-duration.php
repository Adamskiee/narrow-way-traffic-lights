<?php
set_exception_handler(function ($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
require_once "../includes/config.php";

if (!is_verified_logged_in()) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

if (!is_admin_authenticated()) {
    json_response(['success' => false, 'message' => 'Admin access required'], 403);
}

$cacheKey = "db:durations";

$input = get_json_input();

$week_day = $input["weekday"];
$duration_a = $input["weekday-duration-a"];
$duration_b = $input["weekday-duration-b"];
$user_id = $input["user-id"];

$stmt = $conn->prepare("INSERT INTO schedules(admin_id, week_day, duration_a, duration_b) VALUES(?, ?, ?, ?)");
$stmt->bind_param("iiii", $user_id, $week_day, $duration_a, $duration_b);
$stmt->execute();

$redis->del($cacheKey);

json_response([
    "success" => true,
    "message" => "Schedule successfully inserted",
]);
