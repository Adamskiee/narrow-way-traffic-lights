<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
require_once "../includes/config.php";
require_once "../includes/privilege-middleware.php";

if(!is_logged_in()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

if(!is_admin_authenticated()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$cacheKey = "db:durations";

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $week_day = $input["weekday"];
    $duration_a = $input["weekday-duration-a"];
    $duration_b = $input["weekday-duration-b"];
    $user_id = $input["user-id"];

    $stmt = $conn->prepare("INSERT INTO schedules(admin_id, week_day, duration_a, duration_b) VALUES(?, ?, ?, ?)");
    $stmt->bind_param("iiii", $user_id, $week_day, $duration_a, $duration_b);
    $stmt->execute();

    $redis->del($cacheKey);
    
    echo json_encode([
        "success" => true,
        "message" => "Schedule successfully inserted",
    ]);
}catch(Error $e){
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>