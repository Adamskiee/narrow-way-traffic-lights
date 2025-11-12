<?php 
$page_title = "Settings";
include "../includes/header.php"; 
?>

<main>
    <form action="<?= BASE_URL ?>/user/change-password.php" class="validate-form" id="change-password-form" method="post">
        <input type="text" name="username" value="<?= $_SESSION["username"] ?>" disabled>
        <input type="password" name="current_password" placeholder="Current Password" required> 
        <input type="password" name="new_password" placeholder="New Password" required>
        <input type="password" name="confirm_new_password" placeholder="Confirm Password" required>
        <button type="submit">Change password</button>  
        <hr>
        <span id="result"></span>
    </form>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/changePasswordForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php"; ?>