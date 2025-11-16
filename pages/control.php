<?php 
$page_title = "Control";
include "../includes/header.php"; 
?>


<h2>ESP32-CAM Stream</h2>
<img src="" width="480" id="cam1" alt="Camera 1 Stream">
<span id="cam1-status"></span>
<img src="" id="cam2" width="480" alt="Camera 2 Stream">
<span id="cam2-status"></span>

<div class="led-buttons">
  <h2>CAM1</h2>
  <button class="green" onclick="sendLED('cam1', 'green_on')">Green ON</button>
  <button class="green" onclick="sendLED('cam1', 'green_off')">Green OFF</button>
  <button class="red" onclick="sendLED('cam1', 'red_on')">Red ON</button>
  <button class="red" onclick="sendLED('cam1', 'red_off')">Red OFF</button>
</div>

<div class="led-buttons">
  <h2>CAM2</h2>
  <button class="green" onclick="sendLED('cam2', 'green_on')">Green ON</button>
  <button class="green" onclick="sendLED('cam2', 'green_off')">Green OFF</button>
  <button class="red" onclick="sendLED('cam2', 'red_on')">Red ON</button>
  <button class="red" onclick="sendLED('cam2', 'red_off')">Red OFF</button>
</div>

<div class="form-box">
    <form action="<?= BASE_URL ?>/admin/change-ip.php" method="post" id="change-ip-form">
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
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<script src="<?= BASE_URL ?>/assets/js/script.js"></script>
<?php include BASE_PATH . "/includes/footer.php"; ?>