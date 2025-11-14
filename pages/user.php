<?php

$page_title = 'User management page';
include '../includes/header.php';



?>
<main>
    <h2> User Management  </h2>
    <!-- <form action="<?= BASE_URL ?>/admin/add-user.php" id="user-add" method="post">
        <input type="text" name="first-name" placeholder="First Name" value="Operator" required>
        <input type="text" name="last-name" placeholder="Last Name">
        <input type="email" name="email" placeholder="Email" value="operator@gmail.com">
        <input type="text" name="phone" placeholder="Phone #" value="09123456789">
        <input type="text" name="username" placeholder="Username" required value="operator">
        <input type="password" name="password" placeholder="Password" id="password" required value="operator">
        <button type="button" id="generate-btn">Generate</button>
        <button type="submit">Add User</button>
        <hr>
        <span id="result"></span>
    </form> -->
    <button id="add-user-btn">Add User</button>
    <table>
        <thead>
            <tr>
                <td>Username</td>
                <td>First Name</td>
                <td>Last Name</td>
                <td>Email</td>
                <td>Phone #</td>
                <td>Created At</td>
                <td>Action</td>
            </tr>
        </thead>
        <tbody id="user-table-body"></tbody>
    </table>
    <?php include BASE_PATH . "/components/modal.php" ?>
</main>

<style>
    .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(3px);
    transition: opacity 0.3s;
    }

    .modal.hidden {
    opacity: 0;
    pointer-events: none;
    }

    .modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 350px;
    max-width: 90%;
    animation: scaleIn 0.25s ease;
    }

    @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
    }

    .close-btn {
    float: right;
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    }
</style>

<script type="module" src="<?= BASE_URL ?>/assets/js/users.js"></script>

<?php
include BASE_PATH . "/includes/footer.php"
?>