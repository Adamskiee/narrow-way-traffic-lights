<?php
define("BASE_PATH", realpath(__DIR__ . '/..'));
define( "BASE_URL", get_env_var('BASE_URL'));
require BASE_PATH ."/vendor/autoload.php";
require BASE_PATH ."/includes/env.php";
require BASE_PATH ."/includes/helpers.php";
require BASE_PATH ."/includes/JWTHelper.php";
require BASE_PATH ."/includes/auth.php";

headers();

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


$conn = new mysqli(get_env_var("DATABASE_HOSTNAME"), get_env_var("DATABASE_USERNAME"), get_env_var('DATABASE_PASSWORD'), get_env_var("DATABASE_NAME"));

if( $conn->connect_error ) {
    die("Failed". $conn->connect_error);
}

?>