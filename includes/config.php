<?php
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Define absolute server path (not URL)
define("BASE_PATH", realpath(__DIR__ . '/..'));

// Define base URL (useful for linking assets)
define( "BASE_URL", "http://localhost/narrow-way-traffic-lights");


require BASE_PATH ."/vendor/autoload.php";
require BASE_PATH ."/includes/auth.php";
require BASE_PATH ."/includes/helpers.php";
require BASE_PATH ."/includes/JWTHelper.php";

$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => '127.0.0.1',
    'port'   => 6379,
]);

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

function get_env_var($key, $default = null) {
    return $_ENV[$key] ?? $default;
}

// $conn = new mysqli($_ENV["DATABASE_HOSTNAME"], $_ENV["DATABASE_USERNAME"], $_ENV["DATABASE_PASSWORD"], $_ENV["DATABASE_NAME"]);

$conn = new mysqli("localhost", "root", "", "narrowway_traffic_db");

if( $conn->connect_error ) {
    die("Failed". $conn->connect_error);
}


?>