<?php 
header('Content-Type: application/json');
require_once "../includes/config.php";
session_start();

$user = get_authenticated_user();
if(!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $input["user_id"] ?? $user["user_id"];

    $sel = $conn->prepare("SELECT first_name, last_name, username, email, phone_number FROM users WHERE id = ?");
    $sel->bind_param("i", $id);
    $sel->execute();
    $result = $sel->get_result();
    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            "success" => true,
            "information" => $row
        ]);
    }else{
        echo json_encode([
            "success" => false,
            "message" => "Invalid User"
        ]);
    }
}catch(Error $e){
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>