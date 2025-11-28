<?php

$page_title = "Setup Account";
include "./includes/header.php";

$token = $_GET["token"] ?? "";
$user = validateToken($token);

$error = "";
if(!$user) {
    $error = "Invalid token";
}
?>

<main >
    <div class="login-container">
        <div class="login-form-container">
            <?php if(!$error): ?>
            <div class="login-brand">
                <div class="brand-logo">
                    <i class="fas fa-traffic-light"></i>
                </div>
                <h1>Flow<span>Sync</span></h1>
                <p>Traffic Light Management System</p>
            </div>
            <span id="result" class = "text-danger mb-3"></span>
            <form action="<?= BASE_URL ?>/includes/setup-process.php" method="post" class="validate-form login-form" id="setupForm">
                <input type="hidden" value="<?= $_GET["token"]?>" name="token" />
                <div class="mb-3">
                    <label for="new-password" class="form-label">New password</label>
                    <input
                        type="password"
                        class="form-control"
                        name="new-password"
                        id="new-password"
                        placeholder="New Password"
                        required
                    />
                </div>
                <div class="mb-3">
                    <label for="confirm-password" class="form-label">Confirm Password</label>
                    <input
                        type="password"
                        class="form-control"
                        name="confirm-password"
                        id="confirm-password"
                        placeholder="Confirm Password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    class="btn btn-login "
                >
                <span>
                    Change Password
                </span>
                </button>
            </form>
            <?php else: ?>
                <h1>Invalid Token</h1>
            <?php endif; ?>
        </div>
    </div>
</main>
<script src="<?= BASE_URL ?>/assets/js/setupAccount.js" type="module"></script>
<?php
include BASE_PATH . "/includes/footer.php";
?>