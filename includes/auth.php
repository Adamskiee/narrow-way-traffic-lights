<?php 

function logout_user() {
    session_destroy();
}

function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function is_admin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

function is_operator() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'operator';
}

function get_user_role() {
    return $_SESSION['user_role'] ?? 'operator';
}

function require_admin() {
    if (!is_admin()) {
        http_response_code(403);
        die(json_encode(['success' => false, 'message' => 'Admin access required']));
    }
}

function require_login() {
    if (!is_logged_in()) {
        http_response_code(401);
        die(json_encode(['success' => false, 'message' => 'Login required']));
    }
}

function can_access_feature($feature) {
    $role = get_user_role();
    
    // Admin can access everything
    if ($role === 'admin') {
        return true;
    }
    
    // Operator restrictions
    $operator_allowed = [
        'camera_control',    // CAM buttons
        'view_streams'       // View camera streams
    ];
    
    return in_array($feature, $operator_allowed);
}

?>