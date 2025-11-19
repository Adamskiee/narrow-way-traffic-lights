<?php
session_start();

if(isset($_GET["logout"])) {
    session_destroy();
    header("Location: ". BASE_URL . "/login.php");
    exit();
}

$isLoggedIn = isset($_SESSION["user_id"]);
?>
<nav class="navbar">
    <div class="navbar-container">
        <a href=<?= $isLoggedIn ? BASE_URL . "/pages/control.php" : BASE_URL . "/index.php" ?>>Logo</a>
        <?php if ($isLoggedIn): ?>
        <ul class="navbar-links">
            <li><a class="navbar-link" href="<?=BASE_URL?>/pages/control.php">Control</a></li>
            <li><a class="navbar-link" href="<?=BASE_URL?>/pages/user.php">User Management</a></li>
            <li><a class="navbar-link"  href="<?=BASE_URL?>/pages/logs.php">Logs</a></li>
            <li><a class="navbar-link"href="<?=BASE_URL?>/pages/settings.php">Settings</a></li>
        </ul>
        <a href="?logout">Logout</a>
        <?php else: ?>
        <ul class="navbar-links">
            <li><a class="navbar-link" href="<?=BASE_URL?>/index.php">Home</a></li>
            <li><a class="navbar-link" href="<?=BASE_URL?>/pages/about.php">About Us</a></li>
            <li><a class="navbar-link"href="<?=BASE_URL?>/pages/contact.php">Contact Us</a></li>
            <li><a class="navbar-link"  href="<?=BASE_URL?>/pages/tutorial.php">Tutorial</a></li>
        </ul>
        <a href="<?= BASE_URL?>/login.php">Login</a>
        <?php endif; ?>
    </div>
</nav>