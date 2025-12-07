<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../includes/config.php";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user = $_SESSION['pending_2fa_verification'];
if(!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

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
        echo json_encode(["success"=> true, "message" => "recover successfully"]);
        exit;
    }
}
echo json_encode(value: ["success"=> false, "message" => "Recovery code is wrong"]);