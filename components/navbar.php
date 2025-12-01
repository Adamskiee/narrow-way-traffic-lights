<?php

$current = basename($_SERVER['REQUEST_URI']);

if(isset($_GET["logout"])) {
    logout_user();
}

if(!is_logged_in()) {
    $navbarFile = BASE_PATH . "/components/guestNavbar.php";
} elseif(is_super_admin_authenticated()) {
    $navbarFile = BASE_PATH . "/components/superadminNavbar.php";
} elseif(is_admin_authenticated()) {
    $navbarFile = BASE_PATH . "/components/adminNavbar.php";
} elseif(is_operator()) {
    $navbarFile = BASE_PATH . "/components/operatorNavbar.php";
} else {
    $navbarFile = BASE_PATH . "/components/guestNavbar.php";
}

if(file_exists($navbarFile)) {
    include $navbarFile;
} else {
    echo '<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div class="container-fluid">
                <span class="navbar-brand">
                    <i class="fas fa-traffic-light me-2"></i>Traffic Light Control
                </span>
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="' . BASE_URL . '/login.php">
                        <i class="fas fa-sign-in-alt me-1"></i>Login
                    </a>
                </div>
            </div>
          </nav>';
}
?>