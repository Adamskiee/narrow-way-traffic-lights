<?php 
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/includes/config.php';
$page_title = "Login";
include BASE_PATH . "/includes/header.php";
 ?>

 <main class="container">
    <div class="form-box">
        <form action="<?= BASE_URL ?>/includes/login-process.php" method="post" class="validate-form">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" name="login">Login</button>
        </form>
    </div>
</main>

<?php include "./includes/footer.php" ?>