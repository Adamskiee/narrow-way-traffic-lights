<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTHelper {
    private $secret;

    public function __construct() {
        $this->secret = get_env_var("JWT_SECRET_KEY");

        if (empty($this->secret)) {
            throw new Exception('JWT_SECRET not configured in environment variables');
        }
    }
    
    public function createToken($userId, $username, $role, $created_by, $twofa_enabled, $login_time, $verified = false) {
        $payload = [
            'user_id' => $userId,
            'username' => $username,
            'role' => $role,
            'created_by' => $created_by,
            'verified' => $verified,
            'is_2fa_enabled' => $twofa_enabled,
            'login_time' => $login_time,
            'exp' => time() + (60 * 60) 
        ];
        
        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function createRefreshToken($userId) {
        global $conn;
        
        // Generate refresh token
        $refresh_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', time() + (60 * 60 * 24 * 30)); // 30 days

        // Store the token to the database
        $stmt = $conn->prepare("INSERT INTO refresh_tokens(user_id, expires_at, token) VALUES(?, ?, ?)");
        $stmt->bind_param("iss", $userId, $expires_at, $refresh_token);
        $stmt->execute();

        // Return the generated refresh token
        return $refresh_token;
    }

    public function validateRefreshToken($token) {
        global $conn;

        // Select only the token that is not expired
        $stmt = $conn->prepare("SELECT user_id FROM refresh_tokens WHERE token = ? AND expires_at > NOW()");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            return $result->fetch_assoc()['user_id'];
        }else {
            return false;
        }
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