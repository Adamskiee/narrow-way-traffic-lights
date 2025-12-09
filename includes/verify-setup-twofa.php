<?php 
set_exception_handler(function($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");

require_once "./config.php";
require_once "./JWTHelper.php";

$user = get_user();
if(!$user) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

use Vectorface\GoogleAuthenticator;

$ga = new GoogleAuthenticator();
  
$input = get_json_input();

$code = $input["code"];
$secret = $input["secret"];

$check_result = $ga->verifyCode($secret, $code, 2 );
if($check_result) {
    $id = $user['user_id'];
    $stmt = $conn->prepare("UPDATE users SET totp_secret = ?, is_2fa_enabled = 1 WHERE id = ?");
    $stmt->bind_param("si", $secret, $id);
    $stmt->execute();

    $codes = generateRecoveryCodes();
    storeRecoveryCodes($id, $codes);

    $jwt = new JWTHelper();
    $token = $jwt->createToken($user['user_id'], $user['username'], $user['role'], $user['created_by'], 1, $user['login_time'], true);

    setcookie('jwt_token', $token, [
        'expires' => time() + (60 * 60), 
        'path' => '/',
        'httponly' => true,
        'secure' => false, 
        'samesite' => 'Lax'
    ]);
    
    json_response(["success"=> true,"message"=> "Setup successfully", "codes"=>$codes, "redirect" => redirectLink($user['role'])]);
}else {
    json_response(["success"=> false,"message"=> "Code is wrong"]);
}

function redirectLink($role) {
    if($role === "admin") {
        return BASE_URL . "/pages/setup-ip.php";
    }else if($role === "operator") {
        return BASE_URL . "/pages/control.php";
    }else if($role === "super_admin") {
        return BASE_URL . "/pages/admin.php";
    }else {
        return "";
    }
}

function generateRecoveryCodes() {
    $codes = [];

    for ($i = 0; $i < 10; $i++) {
        // Generate a safe 10-char code with hyphen
        $raw = strtoupper(bin2hex(random_bytes(4))); // 8 hex chars
        $code = substr($raw, 0, 4) . '-' . substr($raw, 4, 4);

        $codes[] = $code;
    }

    return $codes;
}

function storeRecoveryCodes($id, $codes) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO user_recovery_codes (user_id, code, used) VALUES (?, ?, 0)");

    foreach ($codes as $code) {
        $code_hash = password_hash($code, PASSWORD_DEFAULT);
        $stmt->bind_param("is", $id, $code_hash);
        $stmt->execute();
    }
}
?>