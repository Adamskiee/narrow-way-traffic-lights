<?php
set_exception_handler(function ($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

require_once "../includes/config.php";

if (!is_verified_logged_in()) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

if (!is_admin_authenticated()) {
    json_response(['success' => false, 'message' => 'Admin access required'], 403);
}

$cacheKey = "db:users";

$input = get_json_input();

$first_name = $input["first-name"];
$last_name = $input["last-name"] ?? "";
$email = $input["email"] ?? "";
$username = $input["username"];
$phone_number = $input["phone"];
$user_id = $input["user-id"];

if (isUsernameExist($conn, $username, $user_id)) {
    json_response([
        "success" => false,
        "message" => "Username exists"
    ]);
}

$stmt = $conn->prepare("UPDATE users SET first_name = ?, last_name = ?, email = ?, username = ?, phone_number = ? WHERE id = ?");
$stmt->bind_param("sssssi", $first_name, $last_name, $email, $username, $phone_number, $user_id);
$stmt->execute();

$redis->del($cacheKey);
$redis->del("db:user:" . $user_id);

json_response([
    "success" => true,
    "message" => "Update successfully"
]);

function isUsernameExist($conn, $username, $user_id)
{
    $stmt = $conn->prepare("SELECT username FROM users WHERE username = ? AND id != ?");
    $stmt->bind_param("si", $username, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        return true;
    } else {
        return false;
    }
}
