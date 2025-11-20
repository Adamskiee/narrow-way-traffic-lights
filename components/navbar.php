<?php
session_start();

$current = basename($_SERVER['REQUEST_URI']);

if(isset($_GET["logout"])) {
    session_destroy();
    header("Location: ". BASE_URL . "/login.php");
    exit();
}

$isLoggedIn = isset($_SESSION["user_id"]);
?>
<nav class="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4 w-7xl">
        <a href=<?= $isLoggedIn ? BASE_URL . "/pages/control.php" : BASE_URL . "/index.php" ?> class="flex items-center space-x-3 rtl:space-x-reverse">
            <span class="self-center text-5xl text-heading font-extrabold whitespace-nowrap text-orange">Flow<span class="text-green">Sync</span></span>
        </a>
        <?php if ($isLoggedIn): ?>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <a href="?logout" class="text-orange bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-bold leading-5 rounded-base text-3xl px-3 py-2 focus:outline-none">Logout</a>
            <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary " aria-controls="navbar-sticky" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="FF2828" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
            </button>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
                <li><a class="nav-link <?= $current === 'control.php' ? 'active': ''?>" href="<?=BASE_URL?>/pages/control.php">Control</a></li>
                <li><a class="nav-link <?= $current === 'user.php' ? 'active': ''?>" href="<?=BASE_URL?>/pages/user.php">User Management</a></li>
                <li><a class="nav-link <?= $current === 'logs.php' ? 'active': ''?>" href="<?=BASE_URL?>/pages/logs.php">Logs</a></li>
                <li><a class="nav-link <?= $current === 'settings.php' ? 'active': ''?>" href="<?=BASE_URL?>/pages/settings.php">Settings</a></li>
            </ul>
        </div>
        <?php else: ?>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <a href="<?= BASE_URL?>/login.php"" class="text-orange bg-brand hover:bg-brand-strong box-border border border-transparent shadow-xs font-bold leading-5 rounded-base text-3xl px-3 py-2 focus:outline-none">Login</a>
            <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none  text-orange" aria-controls="navbar-sticky" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
            </button>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
                <li><a class="nav-link <?= $current === 'index.php' ? 'active': ''?>" href="<?=BASE_URL?>/index.php">Home</a></li>
                <li><a class="nav-link"  href="#tutorial">Tutorial</a></li>
                <li><a class="nav-link" href="<?=BASE_URL?>/index.php#about">About Us</a></li>
                <li><a class="nav-link" href="<?=BASE_URL?>/index.php#contact">Contact Us</a></li>
            </ul>
        </div>
        <?php endif; ?>
    </div>
</nav>

