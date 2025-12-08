<?php 

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
function is_there_operator_login() {
    global $conn;
    $user = get_authenticated_user();

    if(!$user['login_time']) {
        return true;
    }

    $login_time = date('Y-m-d H:i:s', strtotime($user['login_time']));

    $stmt = $conn->prepare("
        SELECT id 
        FROM users 
        WHERE is_active = 1 
            AND created_by = ? 
            AND role = 'operator' 
            AND login_time <= ? 
            AND is_banned = 0
            AND id != ?
            ");
            
    $stmt->bind_param("isi", $user['created_by'], $login_time, $user['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0) {  
        return true;
    }else {
        return false;
    }
}

function is_this_operator_ban() {
    global $conn;
    $user = get_authenticated_user();


    $stmt = $conn->prepare("
        SELECT is_banned 
        FROM users 
        WHERE id = ?");
            
    $stmt->bind_param("i", $user['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();

    $is_banned = $result->fetch_assoc()['is_banned'];

    if($is_banned) {
        return true;
    }else {
        return false;
    }
}

function logout_user() {
    global $conn;
    $user = get_authenticated_user();
    setcookie('jwt_token', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
        'secure' => false,
        'samesite' => 'Lax'
    ]);

    $id = $user["user_id"] ?? $_SESSION['pending_2fa_verification']["user_id"];

    $update_active = $conn->prepare("UPDATE users SET is_active = 0, login_time = NULL WHERE id = ?");
    $update_active->bind_param("i", $id);
    $update_active->execute();

    // Delete caches
    $redis = new Predis\Client([
        'scheme' => 'tcp',
        'host'   => '127.0.0.1',
        'port'   => 6379,
    ]);
    $redis->flushdb();
    $redis->flushall();
    // Only destroy session if one is active
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }
    header("Location: ". BASE_URL . "/index.php");
}

function get_authenticated_user() {
    $user = get_user();
    if($user && $user['verified'] === true) {
        return $user;
    }else {
        return null;
    }
}

function get_user() {
    $token = $_COOKIE['jwt_token'] ?? null;
    if(!$token) {
        return null;
    }

    $jwt = new JWTHelper();
    return $jwt->validateToken($token);
}

function is_verified_logged_in() {
    return get_authenticated_user() !== null;
}

function is_logged_in() {
    return get_user() !== null || isset($_SESSION['pending_2fa_verification']);
}

function is_admin_authenticated() {
    $user = get_authenticated_user();
    return $user && isset($user['role']) && $user['role'] === 'admin';
}

function is_super_admin_authenticated() {
    $user = get_authenticated_user();
    return $user && isset($user['role']) && $user['role'] === 'super_admin';
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
    if (!is_verified_logged_in()) {
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
    if (!is_verified_logged_in()) {
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

function is_2fa_enabled(){
    $user = get_user();

    return $user['is_2fa_enabled'] == 1;
}
?>