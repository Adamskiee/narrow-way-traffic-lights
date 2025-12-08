<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");

require_once "../includes/config.php";

$user = get_authenticated_user();
if($user['role'] != "admin") {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$cacheKey = "db:users";

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $user_id = $input['user-id'];

    $stmt = $conn->prepare("UPDATE users SET is_banned = 1 WHERE id = ? and created_by = ?");
    $stmt->bind_param("ii",$user_id, $user['user_id']);
    $stmt->execute();

    $redis->del($cacheKey);
    $redis->del("db:user:".$user_id);

    echo json_encode([
        "success" => true,
        "message" => "Ban successfully"
    ]);
}catch(Error $e){
    echo json_encode([
        "success" => false,
        "message" => "Ban failed",
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>