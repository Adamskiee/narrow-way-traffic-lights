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
        <a href="<?= BASE_URL . '/pages/control.php'?>" class="navbar-brand">
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
            <!-- User Menu -->
            <ul class="navbar-nav me-auto"></ul>
            <div class="navbar-user-menu">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-details">
                        <span class="user-name"><?= $user['username'] ?? 'User' ?></span>
                        <span class="user-role role-<?= strtolower($user['role'] ?? 'operator') ?>">
                            <?= ucfirst($user['role'] ?? 'Operator') ?>
                            <?php if (($user['role'] ?? 'operator') === 'admin'): ?>
                                <i class="fas fa-crown ms-1"></i>
                            <?php else: ?>
                                <i class="fas fa-user-cog ms-1"></i>
                            <?php endif; ?>
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