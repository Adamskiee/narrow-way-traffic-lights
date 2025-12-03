<?php
require_once "../includes/config.php";

header("Content-Type: application/json");

$user = get_authenticated_user();
if(!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

if(!is_super_admin_authenticated()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$cacheKey = "db:admins";
$data = $redis->get($cacheKey);

if(!$data) {
    try {
        $stmt = $conn->prepare("SELECT id, username, email, first_name, last_name, created_at, phone_number, is_active, is_2fa_enabled FROM users WHERE role = 'admin'");
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        $users = $result->fetch_all(MYSQLI_ASSOC);
        
        $res = json_encode(["success" => true, "users" => $users]);
        
        $redis->setex($cacheKey, 600, $res);
        
        echo $res;
    }catch(Exception $e) {
        echo json_encode([
            "success" => false,
            "error" => "Database error: " . $e->getMessage()
        ]);
    }
}else {
    echo $data;
}

?>