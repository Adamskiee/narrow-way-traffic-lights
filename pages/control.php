<?php 
$page_title = "Control";
include "../includes/header.php"; 
?>


<h2>ESP32-CAM Stream</h2>
<img src="http://10.42.0.76/stream" width="480" id="cam1" alt="Camera 1 Stream">
<img src="htt" id="cam2" width="480" alt="Camera 2 Stream">

<div class="led-buttons">
  <button class="green" onclick="sendWS('green_on')">Green ON</button>
  <button class="green" onclick="sendWS('green_off')">Green OFF</button>
  <button class="red" onclick="sendWS('red_on')">Red ON</button>
  <button class="red" onclick="sendWS('red_off')">Red OFF</button>
</div>

<script src="<?= BASE_URL ?>/assets/js/script.js"></script>
<?php include BASE_PATH . "/components/form/setupIpForm.php"; ?>
<?php include BASE_PATH . "/includes/footer.php"; ?>