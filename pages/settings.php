<?php 
$page_title = "Settings";
include "../includes/header.php"; 
?>

<main>
    <form action="../user/change-password.php">
        <input type="text" name="username">
        <input type="password" name="current_password"> 
        <input type="password" name="new_password">
        <input type="password" name="confirm_new_password">
        <button type="">Change password</button>  
    </form>
</main>

<?php include "../includes/footer.php"; ?>