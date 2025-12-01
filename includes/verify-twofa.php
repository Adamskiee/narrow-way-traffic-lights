<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "./config.php";
require_once "./JWTHelper.php";

$user = get_authenticated_user();
if(!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

use Vectorface\GoogleAuthenticator;
$ga = new GoogleAuthenticator();
$input = json_decode(file_get_contents("php://input"), true);

$code = $input["code"];

$stmt = $conn->prepare("SELECT totp_secret FROM users WHERE id = ?");
$stmt->bind_param("i", $user['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$totp = $result->fetch_assoc()['totp_secret'];

$check_result = $ga->verifyCode($totp, $code, 2 );
if($check_result) {
    $update_active = $conn->prepare("UPDATE users SET is_active = 1 WHERE id = ?");
    $update_active->bind_param("i", $user["user_id"]);
    $update_active->execute();
    
    $ip_check = $conn->prepare("SELECT * FROM ip_addresses WHERE admin_id = ?");
    $ip_check->bind_param("i", $user["created_by"]);
    $ip_check->execute();
    $ip_result = $ip_check->get_result();
    
    $has_ip_address = $ip_result && $ip_result->num_rows > 0;
    
    if($user['role'] == "super_admin") {
        echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/admin.php"]);
    }elseif($user['role'] == "admin") {
        if($has_ip_address) {
            echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/control.php"]);
        }else {
            echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/setup-ip.php"]);
        }
    }else {
        echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/control.php"]);
    }
}else {
    echo json_encode(["success"=> false,"message"=> "Code is wrong"]);
}