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
        $update_login_time = $conn->prepare("UPDATE users SET login_time = NOW() WHERE id = ?");
        $update_login_time->bind_param("i", $row['id']);
        $update_login_time->execute();

        $get_time = $conn->prepare("SELECT login_time FROM users WHERE id = ?");
        $get_time->bind_param("i", $row['id']);
        $get_time->execute();
        $time_result = $get_time->get_result();
        $current_login_time = $time_result->fetch_assoc()['login_time'];

        if($row['is_2fa_enabled'] == 0) {
            $jwt = new JWTHelper();
            $token = $jwt->createToken($row['id'], $row['username'], $row['role'], $row['created_by'], $row['is_2fa_enabled'], (new DateTime())->format('Y-m-d H:i:s'));
    
            setcookie('jwt_token', $token, [
                'expires' => time() + (60 * 60), 
                'path' => '/',
                'httponly' => true,
                'secure' => false, 
                'samesite' => 'Lax'
            ]);
            echo json_encode(["success" => true, "redirect" => BASE_URL . "/setup-twofa.php"]);
        }else {
            $_SESSION['pending_2fa_verification'] = [
                'user_id' => $row['id'],
                'username' => $row['username'],
                'role' => $row['role'],
                'created_by' => $row['created_by'],
                'login_time' => $current_login_time,
                'is_2fa_enabled' => $row['is_2fa_enabled']
            ];

            echo json_encode(["success" => true, "redirect" => BASE_URL . "/twofa.php"]);
        }
    }else {
        echo json_encode(["success" => false, "message"=>"Invalid password"]);
    }
}else {
    echo json_encode(["success" => false, "message"=>"Username not found"]);
}


?>