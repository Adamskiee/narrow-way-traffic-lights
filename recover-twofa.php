<?php 

$page_title = "Recover 2FA";
include "./includes/header.php";

$user = isset($_SESSION['pending_2fa_verification']);
if(!$user) {
    header("Location: " . BASE_URL . "/login.php");
}

use Vectorface\GoogleAuthenticator;

$ga = new GoogleAuthenticator();
$secret = $ga->createSecret();

$qrCodeUrl = $ga->getQRCodeUrl("Google Authenticator Test App", $secret);
?>

<main >
    <div class="login-container">
        <div class="setup-form-container" id="recovery-container">
            <div class="login-brand">
                <h1>Recover Two Factor Authentication</h1>
            </div>
            <form class="validate-form login-form" id="recoverTwoFAForm">
                <span id="result" class = "text-danger mb-3"></span>
                <div class="mb-3">
                    <label for="code" class="form-label">Recovery Code</label>
                    <input
                        type="text"
                        class="form-control"
                        name="recovery-code"
                        id="recovery-code"
                        placeholder="Code"
                        required
                    />
                </div>
                <button type="submit" class="btn btn-login" name="submit">Submit</button>
            </form>
        </div>
        <div class="setup-form-container hidden" id="setup-recovery-container">
            <div class="login-brand">
                <h1>Setup Two Factor Authentication</h1>
            </div>
            <div class="text-center">
                <img src="<?= $qrCodeUrl ?>" alt="" class="img-fluid">
            </div>
            <span id="result" class = "text-danger mb-3"></span>
            <form class="validate-form login-form" id="setupRecoverTwoFAForm">
                <input type="hidden" name="secret" value="<?= $secret ?>">
                <div class="mb-3">
                    <label for="code" class="form-label">Code</label>
                    <input
                        type="text"
                        class="form-control"
                        name="code"
                        id="code"
                        placeholder="Code"
                        required
                    />
                </div>
                <button type="submit" class="btn btn-login" name="submit">Submit</button>
            </form>
        </div>
    </div>
    <?php include BASE_PATH . "/components/infoModal.php" ?>
</main>

<script src="<?= BASE_URL ?>/assets/js/setup-twofa.js" type="module"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>