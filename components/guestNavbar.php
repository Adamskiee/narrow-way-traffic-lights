<?php

$current = basename($_SERVER['REQUEST_URI']);
?>
<nav class="navbar navbar-expand-lg navbar-glassmorphism navbar-guest">
    <div class="container-fluid">
        <!-- Brand -->
        <a href="<?=BASE_URL . '/index.php' ?>" class="navbar-brand">
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
                <!-- Guest Navigation -->
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link <?= $current === 'index.php' ? 'active' : '' ?>" href="#hero">
                        <i class="fas fa-home nav-icon"></i>
                        <span>Home</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#tutorial">
                        <i class="fas fa-graduation-cap nav-icon"></i>
                        <span>Tutorial</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#about">
                        <i class="fas fa-users nav-icon"></i>
                        <span>About Us</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#contact">
                        <i class="fas fa-envelope nav-icon"></i>
                        <span>Contact</span>
                    </a>
                </li>
            </ul>

            <!-- Login Button -->
            <div class="navbar-auth">
                <a class="btn btn-login" href="<?= BASE_URL?>/login.php">
                    <i class="fas fa-sign-in-alt me-2"></i>
                    <span>Login</span>
                </a>
            </div>
        </div>
    </div>
</nav>