<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
require_once "../includes/config.php";
require_once "../includes/privilege-middleware.php";

$user = get_authenticated_user();
if(!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

if (!is_admin_authenticated()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$cacheKey = "db:durations";

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $week_day = $input["weekday"];
    $duration = $input["weekday-duration"];

    $ins = $conn->prepare("UPDATE schedules SET duration = ? WHERE admin_id = ? AND week_day = ?");
    $ins->bind_param("iii", $duration, $user['user_id'], $week_day);
    $ins->execute();

    $redis->del($cacheKey);
    
    echo json_encode([
        "success" => true,
        "message" => "Schedule successfully edited"
    ]);
}catch(Error $e){
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>