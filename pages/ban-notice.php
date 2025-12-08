<?php 
$page_title = "Ban Notice";
include "../includes/header.php";
redirect_if_not_logged_in();
 ?>

<main >
    <div class="login-container">
        <div class="login-form-container">
            <div class="login-brand">
                <h1>Your account has been suspended by the adminstrator</h1>
            </div>
            <p>You will not be able to access the system until the suspension is lifted.</p>
            <a href="<?=BASE_URL?>/pages/control.php" class="btn btn-login">Retry Access</a>
        </div>
    </div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>
