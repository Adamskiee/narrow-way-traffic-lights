<?php 
require_once __DIR__ . "/config.php"; 
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= $page_title ?></title>
 <script src="<?= BASE_URL ?>/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js" defer></script>
<!-- FontAwesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" href="<?= BASE_URL ?>/custom.css">
<link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/style.css?v1">
<link rel="icon" type="image/svg+xml" href="<?= BASE_URL ?>/assets/images/logo.svg">

</head>
<body>
    <?php include BASE_PATH . "/components/navbar.php" ?>