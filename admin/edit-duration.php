<?php 
set_exception_handler(function($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});


require_once "../includes/config.php";

$user = get_authenticated_user();
if(!$user) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

if(!is_admin_authenticated()) {
    json_response(['success' => false, 'message' => 'Admin access required'], 403);
}

$cacheKey = "db:durations";

$input = get_json_input();

$week_day = $input["weekday"];
$duration_a = $input["weekday-duration-a"];
$duration_b = $input["weekday-duration-b"];

$ins = $conn->prepare("UPDATE schedules SET duration_a = ?, duration_b = ? WHERE admin_id = ? AND week_day = ?");
$ins->bind_param("iiii", $duration_a, $duration_b, $user['user_id'], $week_day);
$ins->execute();

$redis->del($cacheKey);

echo json_encode([
    
]);
json_response(["success" => true, "message" => "Duration successfully edited"]);
?>