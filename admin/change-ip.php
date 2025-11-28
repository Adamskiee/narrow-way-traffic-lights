<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
require_once "../includes/config.php";
require_once "../includes/privilege-middleware.php";

$user = get_authenticated_user();
if(!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

if(!is_admin_authenticated()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$cacheKey = "db:ipaddresses";

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $ip_address_1 = $input["ip_address_cam_1"];
    $ip_address_2 = $input["ip_address_cam_2"];
    $admin_id = $user["user_id"];

    $stmt = $conn->prepare("SELECT * from ip_addresses WHERE admin_id = ?");
    $stmt->bind_param("i", $admin_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0 ) {
        $ins = $conn->prepare("UPDATE ip_addresses SET ip_address_1 = ?, ip_address_2 = ? WHERE admin_id = ?");
        $ins->bind_param("ssi", $ip_address_1, $ip_address_2, $admin_id);
        $ins->execute();

        $redis->del($cacheKey);
        
        echo json_encode([
            "success" => true,
            "message" => "IP Addresses successfully changed"
        ]);
    }else{
        echo json_encode([
            "success" => false,
            "message" => "Updating Error"
        ]);
    }


}catch(Error $e){
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>