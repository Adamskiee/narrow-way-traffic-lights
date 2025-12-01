<?php 

$page_title = "Setup 2FA";
include "./includes/header.php";

redirect_if_not_logged_in();
$user = get_authenticated_user();

use Vectorface\GoogleAuthenticator;

$ga = new GoogleAuthenticator();
$secret = $ga->createSecret();

$qrCodeUrl = $ga->getQRCodeUrl("Google Authenticator Test App", $secret);
 ?>

<main >
    <div class="login-container">
        <div class="login-form-container">
            <div class="login-brand">
                <h1>Setup Two Factor Authentication</h1>
            </div>
            <div>
                <img src="<?= $qrCodeUrl ?>" alt="">
            </div>
            <form class="validate-form login-form" id="setupTwoFAForm">
                <span id="result" class = "text-danger mb-3"></span>
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
</main>
<script src="<?= BASE_URL ?>/assets/js/setup-twofa.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>