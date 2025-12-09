<?php
set_exception_handler(function ($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

require_once "../includes/config.php";

$user = get_authenticated_user();
if (!is_verified_logged_in()) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

if (!is_admin_authenticated()) {
    json_response(['success' => false, 'message' => 'Admin access required'], 403);
}

$cacheKey = "db:delay";

$input = get_json_input();

$delay = $input["delay"];
$admin_id = $user["user_id"];

$ins = $conn->prepare("UPDATE delays SET delay = ? WHERE admin_id = ?");
$ins->bind_param("ii", $delay, $admin_id);
$ins->execute();

$redis->del($cacheKey);

json_response([
    "success" => true,
    "message" => "Delay successfully changed"
]);

?>