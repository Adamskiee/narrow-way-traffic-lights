<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "./config.php";
require_once "./JWTHelper.php";
  
$input = json_decode(file_get_contents("php://input"), true);

$username = $input["username"] ?? "";
$password = $input["password"] ?? "";

$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();

    if(password_verify($password, $row["password"])) {
        $jwt = new JWTHelper();
        $token = $jwt->createToken($row['id'], $row['username'], $row['role'], $row['created_by']);

        setcookie('jwt_token', $token, [
            'expires' => time() + (60 * 60), 
            'path' => '/',
            'httponly' => true,
            'secure' => false, 
            'samesite' => 'Lax'
        ]);

        $update_active = $conn->prepare("UPDATE users SET is_active = 1 WHERE id = ?");
        $update_active->bind_param("i", $row["id"]);
        $update_active->execute();
        
        $ip_check = $conn->prepare("SELECT * FROM ip_addresses WHERE admin_id = ?");
        $ip_check->bind_param("i", $row["created_by"]);
        $ip_check->execute();
        $result = $ip_check->get_result();

        if($result && $result->num_rows > 0) {
            echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/control.php", "token" => $token]);
        }
        else{
            echo json_encode(["success" => true, "token" => $token]);
        }
    }else {
        echo json_encode(["success" => false, "message"=>"Invalid password"]);
    }
}else {
    echo json_encode(["success" => false, "message"=>"Username not found"]);
}
?>