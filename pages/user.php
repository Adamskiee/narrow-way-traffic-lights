<?php
$page_title = 'User management page';
include '../includes/header.php';
?>
<main class="container-fluid">
    <div class="">
        <div class="mb-4">
            <h2> User Management  </h2>
        </div>
        <div class="">
            <div class="mb-2">
                <button id="add-user-btn" class="btn btn-primary">Add User</button>
            </div>
            <?php include BASE_PATH . "/components/modal.php" ?>
            <?php include BASE_PATH . "/components/infoModal.php" ?>
            <div class="table-responsive">
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <td>Username</td>
                            <td>First Name</td>
                            <td>Last Name</td>
                            <td>Email</td>
                            <td>Phone #</td>
                            <td>Created At</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody id="user-table-body"></tbody>
                </table>
            </div>
        </div>
    </div>
</main>

<script type="module" src="<?= BASE_URL ?>/assets/js/users.js"></script>

<?php
include BASE_PATH . "/includes/footer.php"
?>