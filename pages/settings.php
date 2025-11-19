<?php 
$page_title = "Settings";
include "../includes/header.php"; 
?>

<main>
    <div>
        <h3>Profile Information</h3>
        <input type="text" id="first-name" disabled>
        <input type="text" id="last-name" disabled>
        <input type="text" id="username" disabled>
        <input type="text" id="email" disabled>
        <input type="text" id="phone-number" disabled>
    </div>
    <div>
        <h3>Change password</h3>
        <form action="<?= BASE_URL ?>/user/change-password.php" class="validate-form" id="change-password-form" method="post">
            <input type="text" name="username" value="<?= $_SESSION["username"] ?>" disabled>
            <input type="password" name="current_password" placeholder="Current Password" required> 
            <input type="password" name="new_password" placeholder="New Password" required>
            <input type="password" name="confirm_new_password" placeholder="Confirm Password" required>
            <button type="submit">Change password</button>  
            <hr>
            <span id="result"></span>
        </form>
    </div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/changePasswordForm.js"></script>
<script src="<?= BASE_URL ?>/assets/js/settings.js"></script>
<?php include BASE_PATH . "/includes/footer.php"; ?>