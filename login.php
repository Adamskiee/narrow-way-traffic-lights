<?php 

$page_title = "Login";
include "./includes/header.php";
 ?>

<main >
    <div class="login-container">
        <div class="login-form-container">
            <div class="login-brand">
                <div class="brand-logo">
                    <i class="fas fa-traffic-light"></i>
                </div>
                <h1>Flow<span>Sync</span></h1>
                <p>Traffic Light Management System</p>
            </div>
            <span id="result" class = "text-danger mb-3"></span>
            <form action="<?= BASE_URL ?>/includes/login-process.php" method="post" class="validate-form login-form" id="loginForm">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input
                        type="text"
                        class="form-control"
                        name="username"
                        id="username"
                        placeholder="Username"
                        required
                    />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <div class="input-group">
                        <input
                            type="password"
                            class="form-control"
                            name="password"
                            id="password"
                            placeholder="Password"
                            required
                        />
                        <button type="button" class="btn btn-outline-secondary password-toggle" title="Show password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    class="btn btn-login "
                >
                <span>
                    Sign In
                </span>
                </button>
            </form>
        </div>
    </div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/login.js"></script>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>