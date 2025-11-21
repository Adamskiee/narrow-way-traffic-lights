<?php 

$page_title = "Login";
include "./includes/header.php";
 ?>

 <main class="pt-20 section-bg h-screen w-full flex justify-center items-center">
    <div class="max-w-5xl w-full bg-[#161616] p-4">
        <div class="">
            <form action="<?= BASE_URL ?>/includes/login-process.php" method="post" class="validate-form" id="loginForm">
                <div class="flex flex-col gap-9">
                    <input type="text" name="username" placeholder="Username" class="rounded-4xl text-4xl py-5 px-12 border-l border-b border-l-orange-500
                    border-b-orange-500 bg-gray-400 text-gray-300 shadow-input" required>
                    <input type="password" name="password" placeholder="Password" class="rounded-4xl text-4xl py-5 px-12" required>
                    <button type="submit" name="login" class="bg-dark-green w-fit text-white py-4 px-14 rounded-4xl text-2xl ">Login</button>
                    <span id="result"></span>
                </div>
            </form>
        </div>
    </div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/loginForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>