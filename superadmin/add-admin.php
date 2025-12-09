<?php
set_exception_handler(function ($e) {
    json_response(["success" => false, "message" => "An error occurred"], 500);
});

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // for CORS (adjust for security)
header("Access-Control-Allow-Methods: POST");
require_once "../includes/config.php";

$user = get_authenticated_user();
if (!is_verified_logged_in()) {
    json_response(['success' => false, 'message' => 'Authentication required'], 401);
}

if (!is_super_admin_authenticated()) {
    json_response(['success' => false, 'message' => 'Super admin access required'], 403);
}

use PHPMailer\PHPMailer\PHPMailer;

$mail = new PHPMailer(true);

$cacheKey = "db:admins";
$mail->SMTPDebug = 0;
$mail->isSMTP();
$mail->Host       = get_env_var("SMTP_HOST");
$mail->SMTPAuth   = true;
$mail->Username   = get_env_var('GMAIL_USERNAME');
$mail->Password   = get_env_var("GMAIL_PASSWORD");
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port       = get_env_var("SMTP_PORT");

$input = get_json_input();

$first_name = $input["first-name"];
$last_name = $input["last-name"] ?? "";
$email = $input["email"];
$username = $input["username"];
$password = $input["password"];
$phone_number = $input["phone"] ?? "";
$user_id = $user['user_id'];
$role = "admin";

$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Username exist"]);
} else {
    $token = generateToken();
    $tokenExpires = date('Y-m-d H:i:s', strtotime('+24 hours'));

    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    $ins_user = $conn->prepare("INSERT INTO users(username, password, email, first_name, last_name, phone_number, created_by, token_expires, setup_token, role) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $ins_user->bind_param("ssssssisss", $username, $password_hash, $email, $first_name, $last_name, $phone_number, $user_id, $tokenExpires, $token, $role);
    $ins_user->execute();

    $redis->del($cacheKey);

    $admin_id = $conn->insert_id;

    $ins_schedule = $conn->prepare("INSERT INTO schedules(admin_id, week_day) VALUES (?,1), (?,2),(?,3), (?,4), (?,5), (?,6), (?,7)");
    $ins_schedule->bind_param("iiiiiii", $admin_id, $admin_id, $admin_id, $admin_id, $admin_id, $admin_id, $admin_id);
    $ins_schedule->execute();

    $ins_delay = $conn->prepare("INSERT INTO delays(admin_id) VALUES (?)");
    $ins_delay->bind_param('i', $admin_id);
    $ins_delay->execute();

    sendSetupEmail($username, $email, $first_name, $token);

    json_response(["success" => true, "message" => "User created successfully"], 201);
}

function generateToken($length = 32)
{
    return bin2hex(string: random_bytes($length));
}

function sendSetupEmail($username, $email, $name, $token)
{
    $setupLink = BASE_URL . "/setup-account.php?token=" . $token;

    global $mail;

    $mail->setFrom(get_env_var("GMAIL_USERNAME"), "FlowSync");
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = "Set up your FlowSync account";
    $mail->Body = "
    <html>
    <head>
        <title>Set up your account</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>Welcome to FlowSync!</h2>
            <p>Hello " . htmlspecialchars($name) . ",</p>
            <p>An account has been created for you with the username of <strong>" . htmlspecialchars($username) . "</strong>. Click the button below to set up your account and create your password:</p>
            
            <div style='text-align: center; margin: 25px 0;'>
                <a href='" . $setupLink . "' class='button'>Set Up Your Account</a>
            </div>
            
            <div class='warning'>
                <strong>Important:</strong> This link will expire in 24 hours. If you didn't request this account, please ignore this email.
            </div>
            
            <p>Or copy and paste this link in your browser:<br>
            <small>" . $setupLink . "</small></p>
        </div>
    </body>
    </html>
    ";
    return $mail->send();
}
