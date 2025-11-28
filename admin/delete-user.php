<?php 
header('Content-Type: application/json');
require_once "../includes/config.php";
require_once "../includes/privilege-middleware.php";

if(!is_logged_in()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

if(!is_admin_authenticated()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $id = $input["user-id"];
    
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Delete user successfully"
    ]);
}catch(Error $e){
    echo json_encode([
        "success" => false,
        "message" => "Delete user failed",
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>