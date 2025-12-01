<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");

require_once "../includes/config.php";

if(!is_logged_in()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

if(!is_super_admin_authenticated()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Super admin access required']);
    exit;
}

$cacheKey = "db:admins";

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $first_name = $input["first-name"];
    $last_name = $input["last-name"] ?? "";
    $email = $input["email"] ?? "";
    $username = $input["username"];
    $phone_number = $input["phone"];
    $user_id = $input["user-id"];

    $stmt = $conn->prepare("UPDATE users SET first_name = ?, last_name = ?, email = ?, username = ?, phone_number = ? WHERE id = ?");
    $stmt->bind_param("sssssi", $first_name, $last_name, $email, $username, $phone_number, $user_id);
    $stmt->execute();

    $redis->del($cacheKey);
    $redis->del("db:admin:".$user_id);

    echo json_encode([
        "success" => true,
        "message" => "Update successfully"
    ]);
}catch(Error $e){
    echo json_encode([
        "success" => false,
        "message" => "Update failed",
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>