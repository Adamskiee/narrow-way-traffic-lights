<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
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

$code = $input["code"];
$secret = $input["secret"];

$check_result = $ga->verifyCode($secret, $code, 2 );
if($check_result) {
    $id = $user['user_id'];
    $stmt = $conn->prepare("UPDATE users SET totp_secret = ? WHERE id = ?");
    $stmt->bind_param("si", $secret, $id);
    $stmt->execute();

    $jwt = new JWTHelper();
    $token = $jwt->createToken($user['user_id'], $user['username'], $user['role'], $user['created_by'],1, $user['login_time'], true);

    setcookie('jwt_token', $token, [
        'expires' => time() + (60 * 60), 
        'path' => '/',
        'httponly' => true,
        'secure' => false, 
        'samesite' => 'Lax'
    ]);
    
    echo json_encode(["success"=> true,"message"=> "Recover successfully", "redirect" => redirectLink($user['role'])]);
}else {
    echo json_encode(["success"=> false,"message"=> "Code is wrong"]);
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

?>