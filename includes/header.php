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
<link rel="stylesheet" href="<?= BASE_URL ?>/custom.css">
<link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/style.css?v1">

</head>
<body>
    <?php include BASE_PATH . "/components/navbar.php" ?>