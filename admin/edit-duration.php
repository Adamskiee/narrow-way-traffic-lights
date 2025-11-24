<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
require_once "../includes/config.php";
require_once "../includes/privilege-middleware.php";

// Check admin privileges
check_admin_access();

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $week_day = $input["weekday"];
    $duration = $input["weekday-duration"];
    $user_id = $input["user-id"];

    $ins = $conn->prepare("UPDATE schedules SET duration = ? WHERE admin_id = ? AND week_day = ?");
    $ins->bind_param("iii", $duration, $user_id, $week_day);
    $ins->execute();
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