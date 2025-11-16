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
        $row = $result->fetch_assoc();
        $admin_id = $row["created_by"];
        
        $stmt = $conn->prepare("SELECT ip_address_1, ip_address_2 FROM ip_addresses WHERE admin_id = ?");
        $stmt->bind_param("i", $admin_id);
        $stmt->execute();
    
        $ip_addresses = $stmt->get_result();
        echo json_encode([
            "success" => true,
            "ip_addresses" => $ip_addresses->fetch_assoc()
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