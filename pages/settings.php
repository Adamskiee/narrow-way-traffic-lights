<?php 
$page_title = "Settings";
include "../includes/header.php"; 
session_start();
?>

<main>
    <form action="<?= BASE_URL ?>/user/change-password.php" class="validate-form">
        <input type="text" name="username" value="<?= $_SESSION["username"] ?>" disabled>
        <input type="password" name="current_password" placeholder="Current Password" required> 
        <input type="password" name="new_password" placeholder="New Password" required>
        <input type="password" name="confirm_new_password" placeholder="Confirm Password" required>
        <button type="submit">Change password</button>  
    </form>
</main>

<?php include BASE_PATH . "/includes/footer.php"; ?>