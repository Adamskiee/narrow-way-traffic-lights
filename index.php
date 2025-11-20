<?php

$page_title = 'Landing page';
include './includes/header.php';
?>
<main class="flex flex-col">
    <section class="pt-20 section-bg w-full h-screen">
        <h2 class="text-orange text-4xl font-bold">FlowSync</h2>
    </section>
    <section class="section-bg w-full h-screen" id="tutorial">
        <h2>Tutorial</h2>
    </section>
    <section class="section-bg w-full h-screen" id="about">
        <h2>About Us</h2>
    </section>
    <section class="section-bg w-full h-screen" id="contact">
        <h2>Contact Us</h2>
    </section>
</main>

<?php
include BASE_PATH . "/includes/footer.php"
?>