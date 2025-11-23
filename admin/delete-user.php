<?php 
header('Content-Type: application/json');
require_once "../includes/config.php";

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