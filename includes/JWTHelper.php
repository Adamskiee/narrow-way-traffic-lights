<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTHelper {
    private $secret = "your-secret-key-change-this";
    
    public function createToken($userId, $username, $role, $created_by) {
        $payload = [
            'user_id' => $userId,
            'username' => $username,
            'role' => $role,
            'created_by' => $created_by,
            'exp' => time() + (60 * 60) 
        ];
        
        return JWT::encode($payload, $this->secret, 'HS256');
    }
    
    public function validateToken($token) {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));
            return (array) $decoded;
        } catch (Exception $e) {
            return false;
        }
    }
}
?>