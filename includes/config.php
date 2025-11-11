<?php
require __DIR__ ."/vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$conn = new mysqli($_ENV["DATABASE_HOSTNAME"], $_ENV["DATABASE_USERNAME"], $_ENV["DATABASE_PASSWORD"], $_ENV["DATABASE_NAME"]);

if( $conn->connect_error ) {
    die("Failed". $conn->connect_error);
}else {
    echo "Database connected";
}


?>