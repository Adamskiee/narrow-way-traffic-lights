<?php 

function logout_user() {
    session_destroy();
}

function is_logged_in() {
    return isset($_SESSION['user_id']);
}

?>