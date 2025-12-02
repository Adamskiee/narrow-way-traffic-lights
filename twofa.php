<?php 

$page_title = "Setup 2FA";
include "./includes/header.php";

$user = isset($_SESSION['pending_2fa_verification']);
if(!$user) {
    header("Location: " . BASE_URL . "/login.php");
}
?>

<main >
    <div class="login-container">
        <div class="login-form-container">
            <div class="login-brand">
                <h1>Two Factor Authentication Verification</h1>
            </div>
            <form class="validate-form login-form" id="twoFAForm">
                <span id="result" class = "text-danger mb-3"></span>
                <div class="mb-3">
                    <label for="code" class="form-label">Code</label>
                    <input
                        type="number"
                        class="form-control"
                        name="code"
                        id="code"
                        min="1"
                        placeholder="6 Digit Code"
                        required
                    />
                </div>
                <button type="submit" class="btn btn-login" name="submit">Submit</button>
            </form>
        </div>
    </div>
</main>
<script type='module' src="<?= BASE_URL ?>/assets/js/setup-twofa.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>