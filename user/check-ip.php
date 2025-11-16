<?php 
header('Content-Type: application/json');
require_once "../includes/config.php";
session_start();

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $input["user_id"] ?? $_SESSION["user_id"];

    $sel = $conn->prepare("SELECT created_by FROM users WHERE id = ?");
    $sel->bind_param("i", $id);
    $sel->execute();
    $result = $sel->get_result();
    if($result->num_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "IP address exist"
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