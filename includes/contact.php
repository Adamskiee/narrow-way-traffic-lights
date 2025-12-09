<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once './config.php';

$mail = new PHPMailer(true);

try {
    $input = get_json_input();
    
    $name = $input["name"] ?? "";
    $email = $input["email"] ?? "";
    $message = $input["message"];
    $phone = $input["phone"] ?? "";

    $mail->SMTPDebug = 0;                     
    $mail->isSMTP();                                          
    $mail->Host       = get_env_var("SMTP_HOST");                     
    $mail->SMTPAuth   = true;                                  
    $mail->Username   = get_env_var('GMAIL_USERNAME');                     
    $mail->Password   = get_env_var("GMAIL_PASSWORD");                              
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;            
    $mail->Port       = get_env_var("SMTP_PORT");         
    
    if(!$mail->smtpConnect()) {
        json_response(["success"=> false, "message"=>'Message has not been sent'], 500);
    }

    $mail->setFrom($email, $name);
    $mail->addAddress(get_env_var("GMAIL_USERNAME"));

    $mail->isHTML(true);                                  
    $mail->Subject = "Traffic Light Website Message from $name";
    $mail->Body  = "
        <h2>Contact Form Message</h2>
        <p><strong>Name:</strong>$name</p>
        <p><strong>Email:</strong>$email</p>
        <p><strong>Message:</strong>$message</p>
    ";
    if($mail->send()) {
        json_response(["success"=> true, "message"=>"Message has been sent"], 200);
    }else {
        json_response(["success"=> false, "message"=>"Message has not been sent"], 500);
    }
} catch (Exception $e) {
    json_response(["success"=> false, "message"=>"Message could not be sent. Mailer Error: {$mail->ErrorInfo}"], 500);
}