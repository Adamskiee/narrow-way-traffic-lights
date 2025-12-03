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
            <form class="validate-form login-form" id="setupForm">
                <input type="hidden" value="<?= $_GET["token"]?>" name="token" />
                <div class="mb-3">
                    <label for="new-password" class="form-label">New password</label>
                    <div class="input-group">
                        <input
                            type="password"
                            class="form-control"
                            name="new-password"
                            id="new-password"
                            placeholder="New Password"
                            required
                        />
                        <button type="button" class="btn btn-outline-secondary password-toggle" title="Show password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="confirm-password" class="form-label">Confirm Password</label>
                    <div class="input-group">
                        <input
                            type="password"
                            class="form-control"
                            name="confirm-password"
                            id="confirm-password"
                            placeholder="Confirm Password"
                            required
                        />
                        <button type="button" class="btn btn-outline-secondary password-toggle" title="Show password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    
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
    <?php include BASE_PATH . "/components/infoModal.php" ?>
</main>
<script src="<?= BASE_URL ?>/assets/js/setupAccount.js" type="module"></script>
<?php
include BASE_PATH . "/includes/footer.php";
?>