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
    <div class="form-box">
        <form action="<?= BASE_URL ?>/includes/setup-ip.php" method="post" id="setup-ip-form">
            <input type="text" name="ip_address_cam_1" placeholder="IP Address CAM 1" required>
            <button type="button" onclick="checkESP(1)">Connect</button>
            <span id="result_cam_1"></span>
            <br>
            <input type="text" name="ip_address_cam_2" placeholder="IP Address CAM 2" required>
            <button type="button" onclick="checkESP(2)">Connect</button>
            <span id="result_cam_2"></span>
            <span id="ip-result"></span>
        </form>
    </div>
</main>

<script>
    function checkESP(num) {
        const ip = document.querySelector(`input[name="ip_address_cam_${num}"]`).value;
        fetch(`http://${ip}/check`, { method: "GET", mode: "no-cors" })
        .then(res => {
            // Handle response here
            console.log(res)
            document.getElementById(`result_cam_${num}`).innerText = "Rechable";
        })
        .catch(error => {
            // Handle errors here
            document.getElementById(`result_cam_${num}`).innerText = "Unreachable";
        });
    }
</script>

<script type="module" src="<?= BASE_URL ?>/assets/js/forms/loginForm.js"></script>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/setupIpForm.js"></script>
<?php include BASE_PATH . "/includes/footer.php" ?>