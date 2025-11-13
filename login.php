<?php 

$page_title = "Login";
include "./includes/header.php";
 ?>

 <main class="container">
    <div class="form-box">
        <form action="<?= BASE_URL ?>/includes/login-process.php" method="post" class="validate-form" id="loginForm">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" name="login">Login</button>
            <hr>
            <span id="result"></span>
        </form>
    </div>
    <?php include BASE_PATH . "/components/form/setupIpForm.php" ?>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/loginForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>