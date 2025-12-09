<?php
$page_title = "Setup IP";
include "../includes/header.php";
redirect_if_not_logged_in();
?>

<main>
    <div class="login-container">
        <div class="login-form-container">
            <div class="login-brand">
                <h1>Set up IP Address</span></h1>
            </div>
            <span id="result" class="text-danger mb-3"></span>
            <form class="validate-form login-form" id="insert-ip-form">
                <div class="mb-3">
                    <div class="input-group">
                        <label for="ip_address_cam_1" class="hidden">IP address</label>
                        <input type="text" class="form-control ip-input" placeholder="IP Address Cam A" aria-label="Duration" name="ip_address_cam_1" id="ip_address_cam_1" aria-describedby="connect-cam-1" data-cam="1" required>
                        <button class="btn btn-secondary" type="button" id="connect-cam-1">Connect</button>
                    </div>
                    <small id="result_cam_1" class="form-text text-danger"></small>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <label for="ip_address_cam_2" class="hidden">IP address</label>
                        <input type="text" class="form-control ip-input" placeholder="IP Address Cam B" aria-label="Duration" name="ip_address_cam_2" id="ip_address_cam_2" aria-describedby="connect-cam-2" data-cam="2" required>
                        <button class="btn btn-secondary" type="button" id="connect-cam-2">Connect</button>
                    </div>
                    <span id="result_cam_2" class="form-text text-danger"></span>
                </div>
                <div class="d-flex">
                    <button type="submit" class="btn submit-btn" id="change-ip-btn">Add IP Address</button>
                </div>
                <div class="d-flex mt-3">
                    <button type="button" class="btn btn-secondary skip-btn" id="skip-ip-btn">Skip</button>
                </div>
                <span id="ip-result"></span>
            </form>
        </div>
    </div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>