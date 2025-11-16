<?php 
$page_title = "Setup IP";
include "./includes/header.php";
 ?>
<main class="container">
    <div class="form-box">
    <form action="<?= BASE_URL ?>/admin/insert-ip.php" method="post" id="insert-ip-form">
        <input type="hidden" name="user_id" value="<?= $_SESSION["user_id"] ?>">
        <input type="text" name="ip_address_cam_1" placeholder="IP Address CAM 1" class="ip-input" required>
        <button type="button" id="connect-cam-1">Connect</button>
        <span id="result_cam_1"></span>
        <br>
        <input type="text" name="ip_address_cam_2" placeholder="IP Address CAM 2" class= "ip-input"  required>
        <button type="button" id="connect-cam-2">Connect</button>
        <span id="result_cam_2"></span>
        <button type="submit">Submit</button>
        <span id="ip-result"></span>
    </form>
</div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/loginForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>
