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

$cacheKey = "db:delay";

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $delay = $input["delay"];
    $admin_id = $user["user_id"];

    $ins = $conn->prepare("UPDATE delays SET delay = ? WHERE admin_id = ?");
    $ins->bind_param("ii", $delay, $admin_id);
    $ins->execute();

    $redis->del($cacheKey);
    
    echo json_encode([
        "success" => true,
        "message" => "Delay successfully changed"
    ]);
}catch(Error $e){
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>