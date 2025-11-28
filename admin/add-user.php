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

if(!is_admin_authenticated()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$cacheKey = "db:users";

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $first_name = $input["first-name"];
    $last_name = $input["last-name"] ?? "";
    $email = $input["email"] ?? "";
    $username = $input["username"];
    $password = $input["password"];
    $phone_number = $input["phone"];
    $user_id = $input["user_id"] ?? $user["user_id"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result && $result->num_rows > 0) {
        echo json_encode(["success" => false, "message"=>"Username exist"]);
    }else {
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $ins = $conn->prepare("INSERT INTO users(username, password, email, first_name, last_name, phone_number, created_by) VALUES(?, ?, ?, ?, ?, ?, ?)");
        $ins->bind_param("ssssssi", $username, $password_hash, $email, $first_name, $last_name, $phone_number, $user_id);
        $ins->execute();

        $redis->del($cacheKey);

        echo json_encode(["success" => true, "message" => "User created successfully"]);
    }
}catch(Error $e){
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}