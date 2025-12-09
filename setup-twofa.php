<?php 

$page_title = "Setup 2FA";
include "./includes/header.php";

$user = get_user();
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
        <div class="setup-form-container" id="setup-container">
            <div class="login-brand">
                <h1>Setup Two Factor Authentication</h1>
            </div>
            <p>To secure your account, follow these steps:</p>
            <ol>
                <li>Install an authenticator app (like Google or Microsoft Authenticator) on your phone.</li>
                <li>Scan the QR code below with the app.</li>
                <li>Enter the 6-digit verification code that appears in the app</li>
            </ol>
            <div class="text-center">
                <img src="<?= $qrCodeUrl ?>" alt="" class="img-fluid">
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
        <div class="setup-form-container hidden" id="recovery-codes-container">
            <div class="login-brand">
                <h1>Store recovery codes</h1>
            </div>
            <h2>Your recovery codes:</h2>
            <ol id="recovery-codes">
                
            </ol>

            <h2>Important Notes:</h2>
            <ul>
                <li>Download these codes store them in a secure place.</li>
                <li>Do not share these codes with anyone.</li>
                <li>If you use all codes or lose them, you can generate new ones in your account security settings (this will invalidate all previous codes).</li>
            </ul>
            <button class="btn btn-secondary mb-3" id="download-code">Download code as .txt</button>
            <button class="btn btn-login" id="continue-btn">Continue</button>
        </div>
    </div>
</main>
<script src="<?= BASE_URL ?>/assets/js/setup-twofa.js" type="module"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>