<?php
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Define absolute server path (not URL)
define("BASE_PATH", realpath(__DIR__ . '/..'));

// Define base URL (useful for linking assets)
define("BASE_URL", "http://localhost/narrow-way-traffic-lights");


require BASE_PATH ."/includes/vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$conn = new mysqli($_ENV["DATABASE_HOSTNAME"], $_ENV["DATABASE_USERNAME"], $_ENV["DATABASE_PASSWORD"], $_ENV["DATABASE_NAME"]);

if( $conn->connect_error ) {
    die("Failed". $conn->connect_error);
}


?>