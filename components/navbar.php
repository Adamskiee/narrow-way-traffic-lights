<?php
session_start();

if(isset($_GET["logout"])) {
    session_destroy();
    header("Location: ". BASE_URL . "/login.php");
    exit();
}

$isLoggedIn = isset($_SESSION["user_id"]);
?>
<nav class="navbar sticky-top navbar-expand-lg container">
  <div class="container-fluid">
    <a href="<?= $isLoggedIn ? BASE_URL . '/pages/control.php' : BASE_URL . '/index.php' ?>" class="navbar-brand header-color">Flow <span>Sync</span></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <?php if ($isLoggedIn): ?>
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="<?=BASE_URL?>/pages/control.php">Control</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="<?=BASE_URL?>/pages/user.php">User Management</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="<?=BASE_URL?>/pages/logs.php">Logs</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="<?=BASE_URL?>/pages/settings.php">Settings</a>
        </li>
    </ul>
    <a class="btn btn-success" href="?logout">Logout</a>
    <?php else: ?>
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="<?=BASE_URL?>/index.php">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#tutorial">Tutorial</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#about">About Us</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#contact">Contact Us</a>
        </li>
      </ul>
        <a class="btn btn-success" href="<?= BASE_URL?>/login.php">Login</a>
    <?php endif; ?>
    </div>
  </div>
</nav>

<script src="<?= BASE_URL ?>/assets/js/navbar.js"></script>