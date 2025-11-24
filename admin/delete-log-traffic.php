<?php
session_start();
require_once "../includes/config.php";

header('Content-Type: application/json');

// Check if user is logged in and has admin privileges
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$log_id = $input['log_id'] ?? null;

if (!$log_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Log ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM traffic_logs WHERE id = ?");
    $stmt->bind_param("i", $log_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Log deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Log not found']);
        }
    } else {
        throw new Exception("Failed to delete log: " . $stmt->error);
    }
    
} catch (Exception $e) {
    error_log("Delete log error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>