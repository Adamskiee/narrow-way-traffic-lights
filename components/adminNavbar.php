<?php

$current = basename($_SERVER['REQUEST_URI']);

if(isset($_GET["logout"])) {
    logout_user();
}

$user = get_authenticated_user() ?? null;
?>

<nav class="navbar navbar-expand-lg navbar-glassmorphism <?= $user ? 'navbar-authenticated' : 'navbar-guest' ?>">
    <div class="container-fluid">
        <!-- Brand -->
        <a href="<?= $user ? BASE_URL . '/pages/control.php' : BASE_URL . '/index.php' ?>" class="navbar-brand">
            <div class="brand-container">
                <div class="brand-icon">
                    <i class="fas fa-traffic-light"></i>
                </div>
                <span class="brand-text">
                    Flow<span class="brand-highlight">Sync</span>
                </span>
            </div>
        </a>

        <!-- Mobile Toggle -->
        <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="toggler-line"></span>
            <span class="toggler-line"></span>
            <span class="toggler-line"></span>
        </button>

        <!-- Navbar Content -->
        <div class="collapse navbar-collapse" id="navbarContent">
            <!-- Authenticated Navigation -->
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link <?= $current === 'control.php' ? 'active' : '' ?>" href="<?=BASE_URL?>/pages/control.php">
                        <i class="fas fa-tachometer-alt nav-icon"></i>
                        <span>Control</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link <?= $current === 'user.php' ? 'active' : '' ?>" href="<?=BASE_URL?>/pages/user.php">
                        <i class="fas fa-users nav-icon"></i>
                        <span>Users</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link <?= $current === 'logs.php' ? 'active' : '' ?>" href="<?=BASE_URL?>/pages/logs.php">
                        <i class="fas fa-clipboard-list nav-icon"></i>
                        <span>Logs</span>
                    </a>
                </li>
                <!-- <li class="nav-item">
                    <a class="nav-link <?= $current === 'settings.php' ? 'active' : '' ?>" href="<?=BASE_URL?>/pages/settings.php">
                        <i class="fas fa-cog nav-icon"></i>
                        <span>Settings</span>
                    </a> -->
                <!-- </li> -->
            </ul>

            <!-- User Menu -->
            <div class="navbar-user-menu">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-details">
                        <span class="user-name"><?= $user['username'] ?? 'User' ?></span>
                        <span class="user-role role-<?= strtolower($user['role'] ?? 'operator') ?>">
                            <?= ucfirst($user['role'] ?? 'Operator') ?>
                            <i class="fas fa-crown ms-1"></i>
                        </span>
                    </div>
                </div>
                <a class="btn btn-logout" href="?logout">
                    <i class="fas fa-sign-out-alt me-2"></i>
                    <span>Logout</span>
                </a>
            </div>
        </div>
    </div>
</nav>