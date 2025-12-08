<?php 
$page_title = "Setup IP";
include "../includes/header.php";
// redirect_if_not_logged_in();
 ?>

<main >
    <div class="login-container">
        <div class="login-form-container">
            <div class="login-brand">
                <h1>Some operator is using the control panel</h1>
            </div>
            <p>This system is currently in use by an authorized operator. Due to security and audit compliance requirements, only one active session is permitted at a time.</p>
            <a href="<?=BASE_URL?>/pages/control.php" class="btn btn-login">Retry Access</a>
        </div>
    </div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>
