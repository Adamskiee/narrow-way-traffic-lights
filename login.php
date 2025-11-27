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
                    <input
                        type="password"
                        class="form-control"
                        name="password"
                        id="password"
                        placeholder="Password"
                        required
                    />
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
            <form action="<?= BASE_URL ?>/admin/insert-ip.php" method="post" id="insert-ip-form" class="hidden login-form">
                <input type="hidden" name="user_id" value="<?= $_SESSION["user_id"] ?>">
                <div class="mb-3">
                    <div class="input-group">
                    <input type="text" class="form-control ip-input" placeholder="IP Address Cam A" aria-label="Duration" name="ip_address_cam_1" aria-describedby="connect-cam-1" required>
                    <button class="btn btn-secondary" type="button" id="connect-cam-1">Connect</button>
                    </div>
                    <small id="result_cam_1" class="form-text text-danger"></small>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                    <input type="text" class="form-control ip-input" placeholder="IP Address Cam B" aria-label="Duration" name="ip_address_cam_2" aria-describedby="connect-cam-2" required>
                    <button class="btn btn-secondary" type="button" id="connect-cam-2">Connect</button>
                    </div>
                    <span id="result_cam_2" class="form-text text-danger"></span>
                </div>
                <button type="submit" class="btn btn-login">Submit</button>
                <span id="ip-result"></span>
            </form>
        </div>
    </div>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/login.js"></script>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>