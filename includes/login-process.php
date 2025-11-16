<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");

ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

require_once "./config.php";
  
// read the raw body of the http request from fetch function
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
        $_SESSION["username"] = $row["username"];
        $_SESSION["user_id"] = $row["id"];

        $ip_check = $conn->prepare("SELECT * FROM ip_addresses WHERE admin_id = ?");
        $ip_check->bind_param("i", $row["created_by"]);
        $ip_check->execute();
        $result = $ip_check->get_result();

        if($result && $result->num_rows > 0)
            echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/control.php"]);
        else{
            echo json_encode(["success" => true, "redirect" => BASE_URL . "/pages/setup-ip.php"]);
        }
    }else {
        echo json_encode(["success" => false, "message"=>"Invalid password"]);
    }
}else {
    echo json_encode(["success" => false, "message"=>"Username not found"]);
}
?>