<?php 
$page_title = "Login";
include "./includes/header.php";
 ?>

 <main class="container">
    <div class="form-box">
        <form action="./includes/login-process.php" method="post">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" name="login">Login</button>
        </form>
    </div>
</main>

<?php include "./includes/footer.php" ?>