<?php 
header('Content-Type: application/json');
require_once "../includes/config.php";

if(!is_logged_in()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

if(!is_admin_authenticated()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$id = $_GET["id"];

$cacheKey = "db:user:". $id;
$data = $redis->get($cacheKey);

if(!$data) {
    try {
        
        $stmt = $conn->prepare("SELECT first_name, last_name, email, phone_number, username, password, created_at FROM users WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();

        $result = $stmt->get_result();
        $res = json_encode([
            "success" => true,
            "user" => $result->fetch_assoc()
        ]);

        $redis->setex($cacheKey,600, $res);

        echo $res;
    }catch(Error $e){
        echo json_encode([
            "success" => false,
            "error" => "Database error: " . $e->getMessage()
        ]);
    }
}else {
    echo $data;
}
?>