function setAuthCookie() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        document.cookie = `jwt_token=${token}; path=/`;
    }
}

function getJWTToken() {
    return localStorage.getItem('jwt_token');
}

function isLoggedIn() {
    const token = getJWTToken();
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        return false;
    }
}

function logout() {
    localStorage.removeItem('jwt_token');
    document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    window.location.href = '../login.php';
}

window.authHelper = { setAuthCookie, getJWTToken, isLoggedIn, logout };