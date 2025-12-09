<?php
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

function redirect($url) {
    header("Location: $url");
    exit;
}

function get_json_input() {
    $data = json_decode(file_get_contents("php://input"));
    $sanitize_data = [];
    foreach ($data as $key => $value) {
        $sanitize_data[$key] = sanitize($value);
    }
    return $sanitize_data;
}

function json_response($data, int $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');

    echo json_encode(
        $data,
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES |
        JSON_PRETTY_PRINT
    );

    exit; 
}

?>