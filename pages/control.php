<?php 
$page_title = "Control";
include "../includes/header.php"; 
?>


<h2>ESP32-CAM Stream</h2>
<!-- <img src="http://10.42.0.76/stream" width="480" id="cam" alt="Camera Stream"> -->

<div class="led-buttons">
  <button class="green" onclick="sendWS('green_on')">Green ON</button>
  <button class="green" onclick="sendWS('green_off')">Green OFF</button>
  <button class="red" onclick="sendWS('red_on')">Red ON</button>
  <button class="red" onclick="sendWS('red_off')">Red OFF</button>
</div>

<?php include "../includes/footer.php"; ?>