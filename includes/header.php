<?php 
require_once __DIR__ . "/config.php"; 
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= $page_title ?></title>
<link href="<?= rtrim(BASE_URL,'/') ?>/dist/css/output.css" rel="stylesheet">

</head>
<body class="">
    <?php include BASE_PATH . "/components/navbar.php" ?>