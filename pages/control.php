<?php 
$page_title = "Control";
include "../includes/header.php"; 
if(!$isLoggedIn) {
  header("Location: ". BASE_URL ."/index.php");
  exit();
}
?>
<main class="container-fluid">
  <?php include BASE_PATH . "/components/infoModal.php" ?>
  <div class="px-2 container">
    <div class="row row-cols-1 row-cols-sm-2 py-4 g-3">
      <div class="col">
        <div class="row gap-2">
          <div class="d-flex justify-content-between align-items-center" >
              <div class="led-control">
                <button id="cam1-button" class="btn btn-lg led-toggle-btn cam1-led" data-color="green" data-state="off">
                  <span class="led-indicator"></span>
                  <span class="led-text">CAM 1: OFF</span>
                </button>
              </div>
              <span id="cam1-count" class="badge bg-secondary fs-6">10</span>
              <button id="auto-mode-button" class="btn btn-primary">Start automatic</button>
            </div>
          <div class="position-relative row justify-content-center m-0" id="cam1-container">
            <img src="<?= BASE_URL ?>/assets/images/gray.png" id="cam1" alt="Camera 1 Stream" class="img-fluid rounded px-0">
            <img class="position-absolute top-50 start-50 translate-middle w-25 h-25" src="<?= BASE_URL ?>/assets/images/camera_backward.png" id="cam1-error-icon" >
          </div>
        </div>
      </div>
      <div class="col" >
        <div class="row gap-2">
          <div class="d-flex justify-content-between align-items-center">
            <button id="manual-mode-button" class="btn btn-primary">Start manual</button>
            <span id="cam2-count" class="badge bg-secondary fs-6">10</span>
            <div class="led-control">
              <button id="cam2-button" class="btn btn-lg led-toggle-btn cam2-led" data-color="red" data-state="off">
                <span class="led-indicator"></span>
                <span class="led-text">CAM 2: OFF</span>
              </button>
            </div>
          </div>
          <div class="position-relative row justify-content-center m-0" id="cam1-container">
            <img src="<?= BASE_URL ?>/assets/images/gray.png" id="cam2" alt="Camera 2 Stream" class="img-fluid rounded px-0">
            <img class="position-absolute top-50 start-50 translate-middle w-25 h-25" src="<?= BASE_URL ?>/assets/images/camera_backward.png" id="cam2-error-icon">
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="mode-btn">
      <h3>Mode</h3>
      <span id="cam2-button-status">Green light</span>
    </div>
    <div id="manual-mode" class="mode-view">
      <div class="led-buttons">
        <h3>CAM1</h3>
        <span id="cam1-button-status">Red light</span>
      </div>
      
      <div class="led-buttons">
        <h3>CAM2</h3>
      </div>
    </div> -->
    <!-- <div id="auto-mode" class="mode-view hidden col">
      <div>
        <h3>CAM1</h3>
        <span id="cam1-count"></span>
      </div>
      <div>
        <h3>CAM2</h3>
        <span id="cam2-count"></span>
      </div>
    </div> -->
    <div class=" mb-5 control__card-container">
      <div class="control__card ">
        <div>
          <h3>Current duration</h3>
          <div class="mb-3">
            <label for="" class="form-label">Duration</label>
            <input
              type="text"
              class="form-control"
              name="duration"
              id="current-duration"
              aria-describedby="helpId"
              disabled
            />
          </div>
        </div>
      </div>
      <div class="control__card">
        <div class="d-flex flex-column" style="gap: 5px;">
          <h3>Duration Schedule</h3>
          <div id="week-days" class="d-flex justify-content-between flex-wrap" style="gap: 5px;">
            <button class="btn flex-fill btn-secondary active" data-week="1">Mon</button>
            <button class="btn flex-fill btn-secondary" data-week="2">Tue</button>
            <button class="btn flex-fill btn-secondary" data-week="3">Wed</button>
            <button class="btn flex-fill btn-secondary" data-week="4">Thu</button>
            <button class="btn flex-fill btn-secondary" data-week="5">Fri</button>
            <button class="btn flex-fill btn-secondary" data-week="6">Sat</button>
            <button class="btn flex-fill btn-secondary" data-week="7">Sun</button>
          </div>
          
          <!-- Always visible duration input form -->
          <div class="mt-3">
            <input type="hidden" name="user-id" value="<?= $_SESSION["user_id"] ?>">
            <label for="duration-input" class="form-label">Duration (seconds)</label>
            <div class="input-group">
              <input type="number" class="form-control" placeholder="Enter duration" id="duration-input" min="1" required>
              <button class="btn btn-primary" type="button" id="save-duration-btn">Save</button>
            </div>
            <small class="form-text text-muted">Select a day above and enter duration</small>
            <div id="duration-result" class="mt-2"></div>
          </div>
          
          <form action="<?= BASE_URL ?>/admin/insert-duration.php" id="add-weekday-form" method="post" class="weekday-form hidden">
            <input type="hidden" name="user-id" value="<?= $_SESSION["user_id"] ?>">
            <input type="hidden" name="weekday" id="weekday-add">
            <span id="add-weekday-form-result"></span>
            <div class="input-group mb-3">
              <input type="number" class="form-control" placeholder="Duration" aria-label="Duration" name="weekday-duration"  id="weekday-duration-add" aria-describedby="submit-button" required>
              <button class="btn btn-primary" type="submit" id="submit-button">Add</button>
            </div>
          </form>
          <form action="<?= BASE_URL ?>/admin/edit-duration.php" method="post" id="edit-weekday-form" class="weekday-form hidden">
            <input type="hidden" name="user-id" value="<?= $_SESSION["user_id"] ?>">
            <input type="hidden" name="weekday" id="weekday-edit">
            <div class="input-group mb-3">
              <input type="number" class="form-control" placeholder="Duration" aria-label="Duration" name="weekday-duration" aria-describedby="submit-button" id="weekday-duration-edit" required>
              <button class="btn btn-primary" type="submit" id="submit-button">Edit</button>
            </div>
            <span id="edit-weekday-form-result"></span>
          </form>
        </div>
      </div>
      <div class="control__card">
        <div class="container-fluid">
          <h3>Change IP Address</h3>
          <form action="<?= BASE_URL ?>/admin/change-ip.php" method="post" id="change-ip-form" novalidate class="needs-validation">
            <input type="hidden" name="user_id" value="<?= $_SESSION["user_id"] ?>">
            <div class="mb-3">
              <div class="input-group">
                <input type="text" class="form-control ip-input" placeholder="IP Address Cam A" aria-label="Duration" name="ip_address_cam_1" aria-describedby="connect-cam-1" required>
                <button class="btn btn-secondary" type="button" id="connect-cam-1">Connect</button>
              </div>
              <small id="result_cam_1" class="form-text text-danger"></small>
            </div>
            <!-- <input type="text" name="ip_address_cam_1" placeholder="IP Address CAM 1" class="ip-input" required>
            <!-- <br> -->
            <div class="mb-3">
              <div class="input-group">
                <input type="text" class="form-control ip-input" placeholder="IP Address Cam A" aria-label="Duration" name="ip_address_cam_2" aria-describedby="connect-cam-2" required>
                <button class="btn btn-secondary" type="button" id="connect-cam-2">Connect</button>
              </div>
              <!-- <input type="text" name="ip_address_cam_2" placeholder="IP Address CAM 2" class= "ip-input"  required>
              <button type="button" id="connect-cam-2">Connect</button> -->
              <span id="result_cam_2" class="form-text text-danger"></span>
            </div>
            <button type="submit" class="btn btn-primary">Change</button>
            <span id="ip-result"></span>
          </form>
        </div>
      </div>
    </div>
  </div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<script type="module" src="<?= BASE_URL ?>/assets/js/control.js"></script>
<?php include BASE_PATH . "/includes/footer.php"; ?>