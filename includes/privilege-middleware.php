<?php
// Admin privilege middleware
require_once '../includes/auth.php';

function check_admin_access() {
    session_start();
    
    if (!is_logged_in()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit();
    }
    
    if (!is_admin()) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin privileges required for this action']);
        exit();
    }
}

function check_camera_access() {
    session_start();
    
    if (!is_logged_in()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit();
    }
    
    if (!can_access_feature('camera_control')) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Camera control access denied']);
        exit();
    }
}

function log_privilege_access($action, $user_id, $user_role) {
    // Log privilege-based actions
    error_log("Privilege Access - Action: $action, User ID: $user_id, Role: $user_role, Time: " . date('Y-m-d H:i:s'));
}
?>