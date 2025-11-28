<?php 

function logout_user() {
    setcookie('jwt_token', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
        'secure' => false,
        'samesite' => 'Lax'
    ]);
}

function get_authenticated_user() {
    $token = $_COOKIE['jwt_token'] ?? null;
    if(!$token) {
        return null;
    }

    $jwt = new JWTHelper();
    return $jwt->validateToken($token);
}

function is_logged_in() {
    return get_authenticated_user() !== null;
}

function is_admin_authenticated() {
    $user = get_authenticated_user();
    return $user && isset($user['role']) && $user['role'] === 'admin';
}

function is_operator() {
    $user = get_authenticated_user();
    return $user && isset($user['role']) && $user['role'] === 'operator';
}

function get_user_role() {
    $user = get_authenticated_user();
    return $user['role'] ?? 'operator';
}

function require_admin() {
    if (!is_admin_authenticated()) {
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
    
    if ($role === 'admin') {
        return true;
    }
    
    $operator_allowed = [
        'camera_control',    
        'view_streams'       
    ];
    
    return in_array($feature, $operator_allowed);
}

function redirect_if_not_logged_in($redirect_url = null) {
    if (!is_logged_in()) {
        $redirect_url = $redirect_url ?: BASE_URL . "/login.php";
        header("Location: " . $redirect_url);
        exit;
    }
}

function validateToken($token) {
    global $conn;
    $token = trim($token);

    $stmt = $conn->prepare("SELECT id FROM users WHERE setup_token = ? AND token_expires > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $user = $stmt->get_result();

    return $user->num_rows > 0;
}
?>