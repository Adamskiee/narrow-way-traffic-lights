<?php 

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
require_once "../includes/config.php";

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


// read the raw body of the http request from fetch function
$input = json_decode(file_get_contents("php://input"), true);

$username = $user["username"] ?? "";
$currentPassword = $input["current_password"] ?? "";
$newPassword = $input["new_password"] ?? "";
$confirmPassword = $input["confirm_new_password"] ?? "";

$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();

    if(password_verify($currentPassword, hash: $row["password"])) {
        $password_hash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
        $stmt->bind_param("ss", $password_hash, $username);
        $stmt->execute();

        echo json_encode(["success" => true, "message"=>"Changed password successfully"]);
    }else {
        echo json_encode(["success" => false, "message"=>"Current password is wrong!"]);
    }
}else {
    echo json_encode(["success" => false, "message"=> $username . "Username not found."]);
}
?>