<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
require_once "../includes/config.php";

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $week_day = $input["weekday"];
    $duration = $input["weekday-duration"];
    $user_id = $input["user-id"];

    $stmt = $conn->prepare("INSERT INTO schedules(admin_id, week_day, duration) VALUES(?, ?, ?)");
    $stmt->bind_param("iii", $user_id, $week_day, $duration);
    $stmt->execute();
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