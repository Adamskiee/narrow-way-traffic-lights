<?php 
$page_title = "Traffic Logs";
include "../includes/header.php"; 

if(!$isLoggedIn) {
  header("Location: ". BASE_URL ."/index.php");
  exit();
}
?>

<main class="container-fluid py-4">
  <!-- Alert Container -->
  <div id="alert-container"></div>
  
  <!-- Page Header -->
  <div class="row mb-4">
    <div class="col">
      <h1 class="h3 mb-0">
        <i class="fas fa-list-alt text-primary me-2"></i>
        Traffic Light Logs
      </h1>
      <p class="text-muted mb-0">Monitor and manage traffic light activity logs</p>
    </div>
    <div class="col-auto">
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-outline-primary" id="refresh-logs" title="Refresh Logs">
          <i class="fas fa-sync-alt"></i>
        </button>
        <button type="button" class="btn btn-outline-success" id="export-logs" title="Export to CSV">
          <i class="fas fa-download"></i> Export
        </button>
      </div>
    </div>
  </div>

  <!-- Filters Card -->
  <div class="card-dark mb-4">
    <div class="card-header">
      <h5 class="card-title mb-0">
        <i class="fas fa-filter me-2"></i>Filters
      </h5>
    </div>
    <div class="card-body">
      <form id="filter-form" class="row g-3">
        <div class="col-md-3">
          <label for="camera-filter" class="form-label">Camera</label>
          <select class="form-select" id="camera-filter">
            <option value="">All Cameras</option>
            <option value="cam1">Camera 1</option>
            <option value="cam2">Camera 2</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="mode-filter" class="form-label">Mode</label>
          <select class="form-select" id="mode-filter">
            <option value="">All Modes</option>
            <option value="auto">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="date-from-filter" class="form-label">From Date</label>
          <input type="date" class="form-control" id="date-from-filter">
        </div>
        <div class="col-md-3">
          <label for="date-to-filter" class="form-label">To Date</label>
          <input type="date" class="form-control" id="date-to-filter">
        </div>
        <div class="col-12">
          <div class="btn-group" role="group">
            <button type="submit" class="btn btn-primary" id="apply-filters">
              <i class="fas fa-search me-1"></i>Apply Filters
            </button>
            <button type="button" class="btn btn-outline-secondary" id="clear-filters">
              <i class="fas fa-times me-1"></i>Clear
            </button>
          </div>
          <div class="form-check form-switch d-inline-block ms-3">
            <input class="form-check-input" type="checkbox" id="auto-refresh">
            <label class="form-check-label" for="auto-refresh">
              Auto-refresh (30s)
            </label>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Logs Table Card -->
  <div class="card-dark">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="card-title mb-0">
        <i class="fas fa-table me-2"></i>Traffic Logs
      </h5>
      <div id="records-info" class="text-muted small">
        Loading...
      </div>
    </div>
    <div class="card-dark p-0">
      <div class="table-responsive">
        <table class="table table-hover table-dark mb-0">
          <thead class="table-dark">
            <tr>
              <th scope="col">
                <i class="fas fa-video me-1"></i>Camera
              </th>
              <th scope="col">
                <i class="fas fa-circle me-1"></i>Light
              </th>
              <th scope="col">
                <i class="fas fa-cog me-1"></i>Mode
              </th>
              <th scope="col" class="text-center">
                <i class="fas fa-clock me-1"></i>Duration
              </th>
              <th scope="col">
                <i class="fas fa-calendar me-1"></i>Timestamp
              </th>
              <th scope="col">
                <i class="fas fa-user me-1"></i>User
              </th>
              <th scope="col">
                <i class="fas fa-envelope me-1"></i>Email
              </th>
              <th scope="col" class="text-center">
                <i class="fas fa-ellipsis-h me-1"></i>Actions
              </th>
            </tr>
          </thead>
          <tbody id="logs-table-body">
            <!-- Logs will be populated here -->
            <tr>
              <td colspan="8" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="mt-2">Loading logs...</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card-footer">
      <div id="pagination-container">
        <!-- Pagination will be populated here -->
      </div>
    </div>
  </div>

  <!-- Statistics Cards -->
  <div class="row mt-4">
    <div class="col-md-3">
      <div class="card-dark text-center">
        <div class="card-body">
          <div class="text-primary">
            <i class="fas fa-chart-line fa-2x mb-2"></i>
          </div>
          <h5 class="card-title">Total Logs</h5>
          <p class="card-text fs-4 fw-bold" id="total-logs-count">-</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card-dark text-center">
        <div class="card-body">
          <div class="text-success">
            <i class="fas fa-robot fa-2x mb-2"></i>
          </div>
          <h5 class="card-title">Auto Mode</h5>
          <p class="card-text fs-4 fw-bold" id="auto-mode-count">-</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card-dark text-center">
        <div class="card-body">
          <div class="text-warning">
            <i class="fas fa-hand-pointer fa-2x mb-2"></i>
          </div>
          <h5 class="card-title">Manual Mode</h5>
          <p class="card-text fs-4 fw-bold" id="manual-mode-count">-</p>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card-dark text-center">
        <div class="card-body">
          <div class="text-info">
            <i class="fas fa-calendar-day fa-2x mb-2"></i>
          </div>
          <h5 class="card-title">Today's Logs</h5>
          <p class="card-text fs-4 fw-bold" id="today-logs-count">-</p>
        </div>
      </div>
    </div>
  </div>
</main>

<!-- Log Details Modal -->
<div class="modal fade" id="logDetailsModal" tabindex="-1" aria-labelledby="logDetailsModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="logDetailsModalLabel">
          <i class="fas fa-info-circle me-2"></i>Log Details
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="logDetailsContent">
        <!-- Log details content will be populated here -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- Include info modal component -->
<?php include BASE_PATH . "/components/infoModal.php"; ?>

<script type="module">
import { openInfoModal, closeInfoModal } from '<?= BASE_URL ?>/assets/js/infoModal.js';
window.openInfoModal = openInfoModal;
window.closeInfoModal = closeInfoModal;
</script>
<script src="<?= BASE_URL ?>/assets/js/logs.js"></script>

<?php include BASE_PATH . "/includes/footer.php"; ?>