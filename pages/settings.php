<?php 
$page_title = "Settings";
include "../includes/header.php"; 
?>

<main class="container-fluid " style="padding-top: 70px;">
    <div class="py-4 mw-100 container" style="width: 500px">
        <h3>Profile Information</h3>
        <div>
            <div class="mb-3">
                <label for="first-name" class="form-label">First Name</label>
                <input
                    type="text"
                    class="form-control"
                    name="first-name"
                    id="first-name"
                    disabled
                />
            </div>
            <div class="mb-3">
                <label for="last-name" class="form-label">Last Name</label>
                <input
                    type="text"
                    class="form-control"
                    name="last-name"
                    id="last-name"
                    disabled
                />
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    type="email"
                    class="form-control"
                    name="email"
                    id="email"
                    disabled
                />
            </div>
            <div class="mb-3">
                <label for="phone-number" class="form-label">Phone Number</label>
                <input
                    type="text"
                    class="form-control"
                    name="phone-number"
                    id="phone-number"
                    disabled
                />
            </div>
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                    type="text"
                    class="form-control"
                    name="username"
                    id="username"
                    disabled
                />
            </div>
        </div>
    </div>
    <div class="py-4 mw-100 container" style="width: 500px">
        <button type="button" class="btn btn-danger-custom" id="change-password-btn">Change Password</button>
        <?php include BASE_PATH . "/components/modal.php" ?>
    </div>
    <?php include BASE_PATH . "/components/infoModal.php" ?>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/changePasswordForm.js"></script>
<script src="<?= BASE_URL ?>/assets/js/settings.js"></script>
<?php include BASE_PATH . "/includes/footer.php"; ?>