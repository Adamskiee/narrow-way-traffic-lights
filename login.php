<?php 

$page_title = "Login";
include "./includes/header.php";
 ?>

<main>
    <div class="container-fluid d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 70px)">
        <div class="mw-100 border p-5 rounded" style="width: 500px;">
            <span id="result" class = "text-danger mb-3"></span>
            <form action="<?= BASE_URL ?>/includes/login-process.php" method="post" class="validate-form" id="loginForm" class="">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input
                        type="text"
                        class="form-control"
                        name="username"
                        id="username"
                        aria-describedby="helpId"
                        placeholder="Username"
                        required
                    />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input
                        type="password"
                        class="form-control"
                        name="password"
                        id="password"
                        aria-describedby="helpId"
                        placeholder="Password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    class="btn btn-primary"
                >
                    Submit
                </button>
            </form>
        </div>
    </div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/loginForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>