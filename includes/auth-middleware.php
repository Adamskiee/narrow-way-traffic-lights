<?php
<?php
require_once __DIR__ . "/config.php";
require_once __DIR__ . "/JWTHelper.php";

function checkAndRefreshToken() {
    $jwt = new JWTHelper();
    
    // Check if jwt_token exists and is valid
    $jwtToken = $_COOKIE['jwt_token'] ?? null;
    
    if ($jwtToken) {
        try {
            $decoded = $jwt->verifyToken($jwtToken);
            
            // Check if token expires in less than 10 minutes
            $timeUntilExpiry = $decoded->exp - time();
            
            if ($timeUntilExpiry < 600) { // 10 minutes
                // Try to refresh using refresh_token
                $refreshToken = $_COOKIE['refresh_token'] ?? null;
                
                if ($refreshToken) {
                    $userId = $jwt->validateRefreshToken($refreshToken);
                    
                    if ($userId) {
                        global $conn;
                        // Fetch user data
                        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
                        $stmt->bind_param("i", $userId);
                        $stmt->execute();
                        $user = $stmt->get_result()->fetch_assoc();
                        
                        // Create new access token
                        $newToken = $jwt->createToken(
                            $user['id'], 
                            $user['username'], 
                            $user['role'], 
                            $user['created_by'], 
                            $user['is_2fa_enabled'], 
                            $user['login_time'], 
                            true
                        );
                        
                        // Set new token
                        setcookie('jwt_token', $newToken, [
                            'expires' => time() + 3600,
                            'path' => '/',
                            'httponly' => true,
                            'secure' => false,
                            'samesite' => 'Lax'
                        ]);
                        
                        setcookie('is_authenticated', '1', [
                            'expires' => time() + 3600,
                            'path' => '/',
                            'httponly' => false,
                            'secure' => false,
                            'samesite' => 'Lax'
                        ]);
                    }
                }
            }
        } catch (Exception $e) {
            // Token invalid, try refresh
            $refreshToken = $_COOKIE['refresh_token'] ?? null;
            
            if ($refreshToken) {
                $userId = $jwt->validateRefreshToken($refreshToken);
                
                if ($userId) {
                    // Same refresh logic as above
                    // ... (duplicate the refresh code here)
                } else {
                    // Clear invalid cookies
                    setcookie('jwt_token', '', time() - 3600, '/');
                    setcookie('refresh_token', '', time() - 3600, '/');
                    setcookie('is_authenticated', '', time() - 3600, '/');
                }
            }
        }
    }
}

// Auto-run on include
checkAndRefreshToken();