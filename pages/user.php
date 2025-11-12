<?php

$page_title = 'User management page';
include '../includes/header.php';
?>
<main>
    <h2> User Management  </h2>
    <form action="<?= BASE_PATH ?>/admin/add-user.php" id="user-add" method="post">
        
    </form>
</main>
<?php
include BASE_PATH . "/includes/footer.php"
?>