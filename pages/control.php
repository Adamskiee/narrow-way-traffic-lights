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
  <!-- Automatic Mode Control -->
  <?php if ($isAdmin): ?>
  <div class="text-center py-3">
    <button id="auto-mode-button" class="btn btn-primary btn-lg px-4">
      <i class="fas fa-play me-2"></i>Start Automatic Mode
    </button>
    <button id="emergency-btn" class="btn btn-primary btn-lg px-4">
      <i class="fas fa-play me-2"></i>Emergency
    </button>
  </div>
  <?php else: ?>
  <div class="text  <div class="px-2 container">
-center py-3">
    <div class="alert alert-info" role="alert">
      <i class="fas fa-info-circle me-2"></i>
      <strong>Operator Mode:</strong> You can control camera streams. Automatic mode requires admin privileges.
    </div>
  </div>
  <?php endif; ?>
  
  <!-- Camera with button -->
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
  <!-- Current duration card -->
  <div class=" mb-5 control__card-container">
    <div class="control__card ">
      <div>
        <h3>Current duration</h3>
        <div class="mb-3">
          <label for="" class="form-label">Duration A</label>
          <input
            type="num"
            class="form-control"
            name="duration-a"
            id="current-duration-a"
            aria-describedby="helpId"
            min="1"
            disabled
          />
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Duration B</label>
          <input
          type="num"
          class="form-control"
          name="duration-b"
          id="current-duration-b"
          aria-describedby="helpId"
          min="1"
          disabled
          />
        </div>
        <button class="btn btn-primary" id="override-btn">Override</button>
      </div>
    </div>

    <!-- Duration schedule card -->
    <div class="control__card <?= !$isAdmin ? 'restricted-access' : '' ?>">
      <div class="d-flex flex-column" style="gap: 5px;">
        <h3>Duration Schedule <?= !$isAdmin ? '<span class="badge bg-warning text-dark ms-2">Admin Only</span>' : '' ?></h3>
        <?php if ($isAdmin): ?>
        <div id="week-days" class="d-flex justify-content-between flex-wrap" style="gap: 5px;">
          <button class="btn flex-fill btn-secondary active" data-week="1">Mon</button>
          <button class="btn flex-fill btn-secondary" data-week="2">Tue</button>
          <button class="btn flex-fill btn-secondary" data-week="3">Wed</button>
          <button class="btn flex-fill btn-secondary" data-week="4">Thu</button>
          <button class="btn flex-fill btn-secondary" data-week="5">Fri</button>
          <button class="btn flex-fill btn-secondary" data-week="6">Sat</button>
          <button class="btn flex-fill btn-secondary" data-week="7">Sun</button>
        </div>
        <?php else: ?>
        <div class="alert alert-warning" role="alert">
          <i class="fas fa-lock me-2"></i>Duration scheduling requires admin privileges.
        </div>
        <?php endif; ?>
        
        <div class="mt-3">
          <input type="hidden" name="user-id" value="<?= $user['user_id'] ?>">
          <label class="form-label">Duration (seconds)</label>
          <div class="input-group">
            <input type="number" class="form-control" placeholder="Enter duration A" id="duration-input-a" min="1" required>
            <input type="number" class="form-control" placeholder="Enter duration B" id="duration-input-b" min="1" required>
            <button class="btn btn-primary" type="button" id="save-duration-btn">Save</button>
          </div>
          <small class="form-text">Select a day above and enter duration</small>
          <div id="duration-result" class="mt-2"></div>
        </div>
        
        <form action="<?= BASE_URL ?>/admin/insert-duration.php" id="add-weekday-form" method="post" class="weekday-form hidden">
          <input type="hidden" name="user-id" value="<?= $user['user_id'] ?>">
          <input type="hidden" name="weekday" id="weekday-add">
          <span id="add-weekday-form-result"></span>
          <div class="input-group mb-3">
            <input type="number" class="form-control" placeholder="Duration" aria-label="Duration" name="weekday-duration"  id="weekday-duration-add" aria-describedby="submit-button" required>
            <button class="btn btn-primary" type="submit" id="submit-button">Add</button>
          </div>
        </form>
        <form action="<?= BASE_URL ?>/admin/edit-duration.php" method="post" id="edit-weekday-form" class="weekday-form hidden">
          <input type="hidden" name="user-id" value="<?= $user['user_id'] ?>">
          <input type="hidden" name="weekday" id="weekday-edit">
          <div class="input-group mb-3">
            <input type="number" class="form-control" placeholder="Duration" aria-label="Duration" name="weekday-duration" aria-describedby="submit-button" id="weekday-duration-edit" required>
            <button class="btn btn-primary" type="submit" id="submit-button">Edit</button>
          </div>
          <span id="edit-weekday-form-result"></span>
        </form>
      </div>
    </div>
    <!-- Change IP address card -->
    <div class="control__card <?= !$isAdmin ? 'restricted-access' : '' ?>">
      <div class="container-fluid">
        <h3>Change IP Address <?= !$isAdmin ? '<span class="badge bg-warning text-dark ms-2">Admin Only</span>' : '' ?></h3>
        <?php if ($isAdmin): ?>
        <form action="<?= BASE_URL ?>/admin/change-ip.php" method="post" id="change-ip-form" novalidate class="needs-validation">
        <?php else: ?>
        <div class="alert alert-warning" role="alert">
          <i class="fas fa-lock me-2"></i>IP address management requires admin privileges.
        </div>
        <form action="<?= BASE_URL ?>/admin/change-ip.php" method="post" id="change-ip-form" novalidate class="needs-validation" style="display: none;">
        <?php endif; ?>
          <div class="mb-3">
            <div class="input-group">
              <label for="ip_address_cam_1" class="hidden">IP address</label>
              <input type="text" class="form-control ip-input" placeholder="IP Address Cam A" aria-label="Duration" name="ip_address_cam_1" id="ip_address_cam_2" aria-describedby="connect-cam-1" data-cam="1" required>
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
          <button type="submit" class="btn btn-primary">Change</button>
          <span id="ip-result"></span>
        </form>
      </div>
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
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>