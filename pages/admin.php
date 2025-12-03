<?php
$page_title = 'Admin Management';
include '../includes/header.php';

redirect_if_not_logged_in();
?>

<main class="container-fluid " style="padding-top: 100px;">
    <!-- Alert Container -->
    <div id="alert-container"></div>
    
    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col">
            <h1 class="h3 mb-0">
                <i class="fas fa-users text-primary me-2"></i>
                Admin Management
            </h1>
        </div>
        <div class="col-auto">
            <div class="btn-group" role="group">
                <button id="add-admin-btn" class="btn btn-primary">
                    <i class="fas fa-plus-circle me-2"></i>Add Admin
                </button>
                <button class="btn btn-outline-primary" id="refresh-users" title="Refresh Admins">
                    <i class="fas fa-sync-alt"></i>
                </button>
                <button class="btn btn-outline-success" id="export-users" title="Export to CSV">
                    <i class="fas fa-download me-1"></i>Export
                </button>
            </div>
        </div>
    </div>
    

    
    <!-- Users Table Card -->
    <div class="card-dark">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
                <i class="fas fa-table me-2"></i>System Users
            </h5>
            <div id="users-count" class="text-muted small">
                Loading...
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-dark table-hover mb-0">
                    <thead class="">
                        <tr>
                            <th scope="col">
                                <i class="fas fa-user me-1"></i>Username
                            </th>
                            <th scope="col">
                                <i class="fas fa-circle me-1"></i>Status
                            </th>
                            <th scope="col">
                                <i class="fas fa-id-card me-1"></i>First Name
                            </th>
                            <th scope="col">
                                <i class="fas fa-id-card me-1"></i>Last Name
                            </th>
                            <th scope="col">
                                <i class="fas fa-envelope me-1"></i>Email
                            </th>
                            <th scope="col">
                                <i class="fas fa-phone me-1"></i>Phone #
                            </th>
                            <th scope="col">
                                <i class="fas fa-calendar me-1"></i>Created At
                            </th>
                            <th scope="col" class="text-center">
                                <i class="fas fa-ellipsis-h me-1"></i>Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody id="user-table-body">
                        <!-- Users will be loaded here via JavaScript -->
                        <tr>
                            <td colspan="7" class="text-center py-4">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <div class="mt-2">Loading users...</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mt-4">
        <div class="col-md-4 mb-5">
            <div class="py-5 card-dark text-center">
                <div class="card-body">
                    <div class="text-primary">
                        <i class="fas fa-users fa-2x mb-2"></i>
                    </div>
                    <h5 class="card-title">Total Admin</h5>
                    <p class="card-text fs-4 fw-bold" id="total-users-count">-</p>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-5">
            <div class="card-dark py-5 text-center">
                <div class="card-body">
                    <div class="text-success">
                        <i class="fas fa-user-check fa-2x mb-2"></i>
                    </div>
                    <h5 class="card-title">Active Admin</h5>
                    <p class="card-text fs-4 fw-bold" id="active-users-count">-</p>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-5">
            <div class="card-dark py-5 text-center">
                <div class="card-body">
                    <div class="text-info">
                        <i class="fas fa-user-shield fa-2x mb-2"></i>
                    </div>
                    <h5 class="card-title">Verified Admin</h5>
                    <p class="card-text fs-4 fw-bold" id="verified-users-count">-</p>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal components -->
    <?php include BASE_PATH . "/components/modal.php" ?>
    <?php include BASE_PATH . "/components/infoModal.php" ?>
</main>

<script type="module" src="<?= BASE_URL ?>/assets/js/admin.js"></script>

<?php
include BASE_PATH . "/includes/footer.php"
?>