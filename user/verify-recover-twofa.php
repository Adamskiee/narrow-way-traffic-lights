<?php 
set_exception_handler(function($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");

require_once "../includes/config.php";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user = $_SESSION['pending_2fa_verification'];
if(!$user) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

$input = get_json_input();

$id = $user['user_id'];
$code = $input['recovery-code'];

$stmt = $conn->prepare("SELECT id, code FROM user_recovery_codes WHERE used = 0 AND user_id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    if(password_verify($code, $row['code'])) {
        // Mark code as used
        $usedStmt = $conn->prepare("
            UPDATE user_recovery_codes
            SET used = 1, used_at = NOW()
            WHERE id = ?
        ");
        $usedStmt->bind_param("i", $row['id']);
        $usedStmt->execute();
        json_response(["success"=> true, "message" => "recover successfully"]);
    }
}

// If recovery code is not found
json_response(["success"=> false, "message" => "Recovery code is wrong"]);