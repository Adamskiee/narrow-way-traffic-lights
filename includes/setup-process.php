<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "./config.php";

$input = json_decode(file_get_contents("php://input"), true);

$new_pass = $input["new-password"] ?? "";
$confirm_pass = $input["confirm-password"] ?? "";
$token = $input["token"] ?? "";

if($new_pass !== $confirm_pass) {
    echo json_encode(["success"=> false, "message"=>"Confirm password is not the same"]);
    exit;
}

try{
    $pass_hash = password_hash($new_pass, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET password = ?, setup_token = NULL, token_expires = NULL WHERE setup_token = ?");
    $stmt->bind_param("ss", $pass_hash, $token);
    $stmt->execute();

    echo json_encode(["success"=> true, "message"=>"Change password successfully", "redirect" => BASE_URL ."/login.php"]);
}catch(Exception $e){
    echo json_encode(["success"=> false, "message"=> $e->getMessage()]);
}

?>