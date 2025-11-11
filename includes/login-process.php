<?php 

ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "./config.php";

if(isset($_POST["login"])) {    
    $username = $_POST["username"];
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        if(password_verify($password, $row["password"])) {
            $_SESSION["username"] = $row["username"];
            $_SESSION["user_id"] = $row["id"];

            header("Location: ../pages/dashboard.php");
            exit();
        }else {
            echo "Invalid password";
            header("Location: ../login.php");
            exit();
        }
    }
}
?>