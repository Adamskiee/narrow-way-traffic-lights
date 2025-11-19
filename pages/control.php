<?php 
$page_title = "Control";
include "../includes/header.php"; 
if(!$isLoggedIn) {
  header("Location: ". BASE_URL ."/index.php");
  exit();
}
?>

<h2>ESP32-CAM Stream</h2>
<img src="" width="480" id="cam1" alt="Camera 1 Stream">
<span id="cam1-status"></span>
<img src="" id="cam2" width="480" alt="Camera 2 Stream">
<span id="cam2-status"></span>
<div class="mode-btn">
  <h3>Mode</h3>
  <button id="auto-mode-button">Start automatic</button>
  <button id="manual-mode-button">Start manual</button>
</div>
<div id="manual-mode" class="mode-view">
  <div class="led-buttons">
    <h3>CAM1</h3>
    <button id="cam1-button" data-color="green">Green ON</button>
    <span id="cam1-button-status">Red light</span>
  </div>
  
  <div class="led-buttons">
    <h3>CAM2</h3>
    <button id="cam2-button" data-color="red">Red ON</button>
    <span id="cam2-button-status">Green light</span>
  </div>
</div>
<div id="auto-mode" class="mode-view hidden">
  <div>
    <h3>CAM1</h3>
    <span id="cam1-count"></span>
  </div>
  <div>
    <h3>CAM2</h3>
    <span id="cam2-count"></span>
  </div>
</div>
<div>
  <h2>Admin Control</h2>
  <div>
    <h3>Current duration</h3>
    <input type="text" name="duration" id="current-duration" disabled>
  </div>
  <div>
    <h3>Durations</h3>
    <ul id="week-days">
      <li><button class="active" data-week="1">Mon</button></li>
      <li><button data-week="2">Tue</button></li>
      <li><button data-week="3">Wed</button></li>
      <li><button data-week="4">Thu</button></li>
      <li><button data-week="5">Fri</button></li>
      <li><button data-week="6">Sat</button></li>
      <li><button data-week="7">Sun</button></li>
    </ul>
    
    <form action="<?= BASE_URL ?>/admin/insert-duration.php" id="add-weekday-form" method="post" class="weekday-form hidden">
      <input type="hidden" name="user-id" value="<?= $_SESSION["user_id"] ?>">
      <input type="hidden" name="weekday" id="weekday-add">
      <input type="number" name="weekday-duration" id="weekday-duration-add" placeholder="Duration">
      <span id="add-weekday-form-result"></span>
      <button type="submit">Add</button>
    </form>
    <form action="<?= BASE_URL ?>/admin/edit-duration.php" method="post" id="edit-weekday-form" class="weekday-form hidden">
      <input type="hidden" name="user-id" value="<?= $_SESSION["user_id"] ?>">
      <input type="hidden" name="weekday" id="weekday-edit">
      <input type="number" name="weekday-duration" id="weekday-duration-edit">
      <span id="edit-weekday-form-result"></span>
      <button type="submit">Edit</button>
    </form>
  </div>
  <div class="form-box">
    <h3>Change IP</h3>
    <form action="<?= BASE_URL ?>/admin/change-ip.php" method="post" id="change-ip-form">
        <input type="hidden" name="user_id" value="<?= $_SESSION["user_id"] ?>">
        <input type="text" name="ip_address_cam_1" placeholder="IP Address CAM 1" class="ip-input" required>
        <button type="button" id="connect-cam-1">Connect</button>
        <span id="result_cam_1"></span>
        <br>
        <input type="text" name="ip_address_cam_2" placeholder="IP Address CAM 2" class= "ip-input"  required>
        <button type="button" id="connect-cam-2">Connect</button>
        <span id="result_cam_2"></span>
        <button type="submit">Change</button>
        <span id="ip-result"></span>
    </form>
  </div>
</div>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<script type="module" src="<?= BASE_URL ?>/assets/js/control.js"></script>
<?php include BASE_PATH . "/includes/footer.php"; ?>