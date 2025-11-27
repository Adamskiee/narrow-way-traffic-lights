<?php 
$page_title = "Setup IP";
include "../includes/header.php";
 ?>
<main class="container">
    <div class="form-box">
    <div class="mb-3">
        <div class="input-group">
            <input type="text" class="form-control ip-input" placeholder="IP Address Cam A" aria-label="Duration" name="ip_address_cam_1" aria-describedby="connect-cam-1" required>
            <button class="btn btn-secondary" type="button" id="connect-cam-1">Connect</button>
            </div>
            <small id="result_cam_1" class="form-text text-danger"></small>
        </div>
        <div class="mb-3">
            <div class="input-group">
            <input type="text" class="form-control ip-input" placeholder="IP Address Cam A" aria-label="Duration" name="ip_address_cam_2" aria-describedby="connect-cam-2" required>
            <button class="btn btn-secondary" type="button" id="connect-cam-2">Connect</button>
            </div>
            <span id="result_cam_2" class="form-text text-danger"></span>
        </div>
    </div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/loginForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>
