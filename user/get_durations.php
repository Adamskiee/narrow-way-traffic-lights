<?php
require_once "../includes/config.php";

header("Content-Type: application/json");

$user = get_authenticated_user();
if(!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

try {
    $user_id = $user["user_id"];

    $stmt = $conn->prepare("SELECT week_day, duration FROM users u JOIN schedules s ON u.created_by = s.admin_id WHERE u.id = ? GROUP BY s.id");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $schedules = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["success" => true, "schedules" => $schedules]);
}catch(Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>