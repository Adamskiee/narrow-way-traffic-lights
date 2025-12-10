<?php 
set_exception_handler(function($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

require_once "./config.php";
require_once "./JWTHelper.php";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user = $_SESSION['pending_2fa_verification'];
if(!$user) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

use Vectorface\GoogleAuthenticator;
$ga = new GoogleAuthenticator();
$input = get_json_input();

$code = $input["code"] ?? '';
if(empty($code)) {
    json_response(['success' => false, 'message' => 'Code is required']);
}

$stmt = $conn->prepare("SELECT totp_secret FROM users WHERE id = ?");
$stmt->bind_param("i", $user['user_id']);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows === 0) {
    json_response(['success' => false, 'message' => 'User not found']);
}

$totp = $result->fetch_assoc()['totp_secret'];

if(empty($totp)) {
    json_response(['success' => false, 'message' => 'Two factor authentication is not enabled']);
}

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
    if(isset($_COOKIE['refresh_token']) && $jwt->validateRefreshToken($_COOKIE['refresh_token']) != $user['user_id']) {
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
        $redirect = BASE_URL . "/pages/admin.php";
    }elseif($user['role'] == "admin") {
        if($has_ip_address) {
            $redirect = BASE_URL . "/pages/control.php";
        }else {
            $redirect = BASE_URL . "/pages/setup-ip.php";
        }
    }else {
        json_response(["success" => true, "redirect" => BASE_URL . "/pages/control.php"]);
        $redirect = BASE_URL . "/pages/control.php";
    }
    json_response(["success" => true, "redirect" => $redirect]);
}else {
    json_response(["success"=> false,"message"=> "Code is wrong"]);
}