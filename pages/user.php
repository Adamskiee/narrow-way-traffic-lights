<?php

$page_title = 'User management page';
include '../includes/header.php';
?>
<main>
    <h2> User Management  </h2>
    <form action="<?= BASE_URL ?>/admin/add-user.php" id="user-add" method="post">
        <input type="text" name="first-name" placeholder="First Name" value="Operator" required>
        <input type="text" name="last-name" placeholder="Last Name">
        <input type="email" name="email" placeholder="Email" value="operator@gmail.com">
        <input type="text" name="username" placeholder="Username" required value="operator">
        <input type="password" name="password" placeholder="Password" id="password" required value="operator">
        <button type="button" id="generate-btn">Generate</button>
        <button type="submit">Add User</button>
        <hr>
        <span id="result"></span>
    </form>
</main>
<script type="module" src="<?= BASE_URL ?>/assets/js/forms/addUserForm.js"></script>
<?php
include BASE_PATH . "/includes/footer.php"
?>