<?php 
header('Content-Type: application/json');
require_once "../includes/config.php";

try {
    $id = $_GET["id"];

    $stmt = $conn->prepare("SELECT first_name, last_name, email, phone_number, username, password FROM users WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();

    $result = $stmt->get_result();
    echo json_encode([
        "success" => true,
        "user" => $result->fetch_assoc()
    ]);
}catch(Error $e){
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>