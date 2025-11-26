<?php
// filepath: /opt/lampp/htdocs/narrow-way-traffic-lights/debug.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Debug Information</h1>";

// Test PHP
echo "<h2>PHP Version:</h2>";
echo phpversion();

// Test database connection
echo "<h2>Database Connection:</h2>";
try {
    $pdo = new PDO("mysql:host=localhost;dbname=narrowway_traffic_db", "root", "");
    echo "✅ Database connected successfully";
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage();
}

// Test file paths
echo "<h2>File System:</h2>";
$files_to_check = [
    'includes/config.php',
    'includes/header.php',
    'vendor/autoload.php',
    '.env'
];

foreach ($files_to_check as $file) {
    if (file_exists($file)) {
        echo "✅ $file exists<br>";
    } else {
        echo "❌ $file missing<br>";
    }
}

// Test Composer
echo "<h2>Composer:</h2>";
if (file_exists('vendor/autoload.php')) {
    require_once 'vendor/autoload.php';
    echo "✅ Composer autoload works";
} else {
    echo "❌ Run 'composer install'";
}

phpinfo();
?>