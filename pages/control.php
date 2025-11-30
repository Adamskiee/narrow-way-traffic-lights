<?php 
$page_title = "Control";
include "../includes/header.php"; 

redirect_if_not_logged_in();

$user = get_authenticated_user();
$userRole = get_user_role();
$isAdmin = is_admin_authenticated();
$canControlDuration = can_access_feature('duration_control');
$canChangeIP = can_access_feature('ip_management');
$canControlCameras = can_access_feature('camera_control');
?>
<main class="container-fluid" style="padding-top: 70px;">
  <div class="row">
  <!-- Automatic Mode Control -->
  <div class="text-center py-3 col-12">
    <button id="auto-mode-button" class="btn btn-primary btn-lg px-4">
      <i class="fas fa-play me-2"></i>Start Automatic Mode
    </button>
    <button id="emergency-btn" class="btn btn-primary btn-lg px-4">
      <i class="fas fa-play me-2"></i>Emergency
    </button>
  </div>

  <!-- Camera with button -->
  <div class="row row-cols-1 row-cols-sm-2 py-4 g-3 col-12">
    <div class="col">
      <div class="row gap-2">
        <div class="d-flex justify-content-between align-items-center" >
            <div class="led-control">
              <button id="cam1-button" class="btn btn-lg led-toggle-btn cam1-led" data-color="green" data-state="off">
                <span class="led-indicator"></span>
                <span class="led-text">CAM 1: OFF</span>
              </button>
            </div>
            <span id="cam1-count" class="badge bg-secondary fs-6"></span>
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
          <span id="cam2-count" class="badge bg-secondary fs-6"></span>
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
  <div class="mb-5 control__card-container col-12">
    <!-- Current duration card -->
    <div class="control__card ">
      <div>
        <h3>Current duration</h3>
        <div class="mb-3">
          <label for="current-delay" class="form-label">Delay (seconds)</label>
          <div class="input-group">
            <input
              type="num"
              class="form-control"
              name="current-delay"
              id="current-delay"
              min="1"
              disabled
            />
            <button id="current-delay-btn" class="btn btn-secondary" disabled data-state="edit">Edit</button>
          </div>
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Duration A (seconds)</label>
          <div class="input-group">
            <input
              type="num"
              class="form-control"
              name="duration-a"
              id="current-duration-a"
              aria-describedby="helpId"
              min="1"
              disabled
            />
            <button id="current-duration-a-btn" class="btn btn-secondary" disabled data-state="edit">Edit</button>
          </div>
        </div>
        <div class="mb-3">
          <label for="current-duration-b" class="form-label">Duration B (seconds)</label>
          <div class="input-group">
            <input
            type="num"
            class="form-control"
            name="duration-b"
            id="current-duration-b"
            min="1"
            disabled
            />
            <button id="current-duration-b-btn" class="btn btn-secondary" disabled data-state="edit">Edit</button>
          </div>
        </div>
        <button class="btn btn-primary" id="override-btn">Override</button>
      </div>
    </div>
    
    <?php if ($isAdmin): ?>
    <!-- Duration schedule card -->
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
        
        <div class="mb-3">
          <input type="hidden" name="user-id" value="<?= $user['user_id'] ?>">
          <div class="">
            <label class="form-label">Duration A</label>
            <input type="number" class="form-control" placeholder="Enter duration A" id="duration-input-a" min="1" required disabled>
          </div>
          <div class="mb-3">
            <label class="form-label">Duration B</label>
            <input type="number" class="form-control" placeholder="Enter duration B" id="duration-input-b" min="1" required disabled>
          </div>
          <button class="btn btn-primary" type="button" id="save-duration-btn" data-state="edit">Edit</button>
          <button class="btn btn-secondary" type="button" id="cancel-save-duration-btn" disabled>Close</button>
        </div>
      </div>
    </div>
    <!-- Change IP address card -->
    <div class="control__card">
      <div class="container-fluid">
        <h3>Change IP Address</h3>
        <form action="<?= BASE_URL ?>/admin/change-ip.php" method="post" id="change-ip-form">
          <div class="mb-3">
            <div class="input-group">
              <label for="ip_address_cam_1" class="hidden">IP address</label>
              <input type="text" class="form-control ip-input" placeholder="IP Address Cam A" aria-label="Duration" name="ip_address_cam_1" id="ip_address_cam_1" aria-describedby="connect-cam-1" data-cam="1" required disabled>
              <button class="btn btn-secondary" type="button" id="connect-cam-1" disabled>Connect</button>
            </div>
            <small id="result_cam_1" class="form-text text-danger"></small>
          </div>
          <div class="mb-3">
            <div class="input-group">
              <label for="ip_address_cam_2" class="hidden">IP address</label>
              <input type="text" class="form-control ip-input" placeholder="IP Address Cam B" aria-label="Duration" name="ip_address_cam_2" id="ip_address_cam_2" aria-describedby="connect-cam-2" data-cam="2" required disabled>
              <button class="btn btn-secondary" type="button" id="connect-cam-2" disabled>Connect</button>
            </div>
            <span id="result_cam_2" class="form-text text-danger"></span>
          </div>
          <div class="d-flex">
            <button type="button" class="btn submit-btn" id="change-ip-btn">Change IP Address</button>
            <button type="button" class="btn btn-secondary" id="cancel-change-ip-btn" disabled>Cancel</button>
          </div>
          <span id="ip-result"></span>
        </form>
      </div>
    </div>
    <!-- Change Delay Card -->
    <div class="control__card">
      <div class="container-fluid">
        <h3>Change Delay</h3>
        <form action="<?= BASE_URL ?>/admin/update-delay.php" method="post" id="change-delay-form" novalidate class="needs-validation">
          <div class="mb-3">
              <label for="delay" class="hidden">Delay</label>
              <input type="text" class="form-control" placeholder="Delay" aria-label="Delay" name="delay" id="delay-input"  data-cam="1" required disabled>
          </div>
          <button type="button" class="btn btn-primary" id="change-delay-btn">Change</button>
          <button type="button" class="btn btn-secondary" id="close-change-delay-btn" disabled>Close</button>
          <span id="ip-result"></span>
        </form>
      </div>
    </div>
    <?php endif; ?>
  </div>
  </div>
  <!-- Modal Component -->
  <?php include BASE_PATH . "/components/infoModal.php" ?>
</main>

<!-- Pass user role data to JavaScript -->
<script>
  window.userRole = '<?= $userRole ?>';
  window.isAdmin = <?= $isAdmin ? 'true' : 'false' ?>;
  window.canControlCameras = <?= $canControlCameras ? 'true' : 'false' ?>;
</script>

<script type="module" src="<?= BASE_URL ?>/assets/js/control.js"></script>
<?php include BASE_PATH . "/includes/footer.php"; ?>
<?php if ($isAdmin): ?><script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
  <?php endif; ?>