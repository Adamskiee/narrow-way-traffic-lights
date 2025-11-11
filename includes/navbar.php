<?php

if(isset($_GET["logout"])) {
    header("Location: ../login.php");
    exit();
}

// if(!isset($_SESSION["user_id"])) {
//     header("Location: ../index.php");
//     exit();
// }

?>

<nav class="navbar">
    <div class="navbar-container">
        <a href="../pages/dashboard.php">Logo</a>
        <ul class="navbar-links">
            <li><a class="navbar-link" href="../pages/dashboard.php">Dashboard</a></li>
            <li><a class="navbar-link" href="../pages/control.php">Control</a></li>
            <li><a class="navbar-link"  href="../pages/logs.php">Logs</a></li>
            <li><a class="navbar-link"href="../pages/settings.php">Settings</a></li>
        </ul>
        <a href="?logout">Logout</a>
    </div>
</nav>