<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true"); // ✅ Required for cookies
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "./config.php";
require_once "./JWTHelper.php";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user = $_SESSION['pending_2fa_verification'];
if(!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

use Vectorface\GoogleAuthenticator;
$ga = new GoogleAuthenticator();
$input = json_decode(file_get_contents("php://input"), true);

$code = $input["code"] ?? '';
if(empty($code)) {
    echo json_encode(['success' => false, 'message' => 'Code is required']);
    exit;
}

$stmt = $conn->prepare("SELECT totp_secret FROM users WHERE id = ?");
$stmt->bind_param("i", $user['user_id']);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

$totp = $result->fetch_assoc()['totp_secret'];

if(empty($totp)) {
    echo json_encode(['success' => false, 'message' => 'TOTP not configured']);
    exit;
}

try {
    $check_result = $ga->verifyCode($totp, $code, 2 );
    if($check_result) {
        
        $jwt = new JWTHelper();
        $token = $jwt->createToken($user['user_id'], $user['username'], $user['role'], $user['created_by'], $user['is_2fa_enabled'], $user['login_time'], true);

        // token avaliable for 1 hour
        $cookie_set = setcookie('jwt_token', $token, [
            'expires' => time() + (60 * 60), 
            'path' => '/',
            'httponly' => true,
            'secure' => false, 
            'samesite' => 'Lax'
        ]);

        // refresh token available for 30 days
        if($jwt->validateRefreshToken($_COOKIE['refresh_token']) != $user['user_id']) {
            $select_refresh_token = $conn->prepare("SELECT token FROM refresh_tokens WHERE user_id = ? AND expires_at > NOW()");
            $select_refresh_token->bind_param("i", $user['user_id']);
            $select_refresh_token->execute();

            $result = $select_refresh_token->get_result();
            if($result && $result->num_rows > 0) {
                $refresh_token = $result->fetch_assoc()['token'];
            }else {
                $refresh_token = $jwt->createRefreshToken($user['user_id']);
            }
            setcookie('refresh_token', $refresh_token, [
                'expires' => time() + (60 * 60 * 24 * 30),
                'path' => '/',
                'httponly' => true,
                'secure' => false,
                'samesite' => 'Lax'
            ]);
        }
        
        unset($_SESSION['pending_2fa_verification']);
        
        $update_active = $conn->prepare("UPDATE users SET is_active = 1 WHERE id = ?");
        $update_active->bind_param("i", $user["user_id"]);
        $update_active->execute();
        
        if($user['role'] === 'admin') {
            $ip_check = $conn->prepare("SELECT * FROM ip_addresses WHERE admin_id = ?");
            $ip_check->bind_param("i", $user["user_id"]);
            $ip_check->execute();
            $ip_result = $ip_check->get_result();
            $has_ip_address = $ip_result && $ip_result->num_rows > 0;
        }
        
        
        if($user['role'] == "super_admin") {
            echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/admin.php"]);
        }elseif($user['role'] == "admin") {
            if($has_ip_address) {
                echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/control.php", "token"=> $token, "cookie_set"=>$cookie_set]);
            }else {
                echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/setup-ip.php"]);
            }
        }else {
            echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/control.php"]);
        }
    }else {
        echo json_encode(["success"=> false,"message"=> "Code is wrong"]);
    }
}catch(Error $e) {
    echo json_encode(["success"=> false,"message"=> "Invalid Code"]);
}