<?php
require_once "../includes/config.php";

header("Content-Type: application/json");
session_start();

try {
    $stmt = $conn->prepare("SELECT id, username, email, first_name, last_name, created_at FROM users WHERE created_by = ? AND id != ?");
    $stmt->bind_param("ii", $_SESSION["user_id"], $_SESSION["user_id"]);
    $stmt->execute();
    $result = $stmt->get_result();
    $users = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["success" => true, "users" => $users]);
}catch(Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}

?>