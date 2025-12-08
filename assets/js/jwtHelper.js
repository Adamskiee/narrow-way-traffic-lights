function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        // Get the cookie
        let c = ca[i];

        // Remove leading spaces
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        // If cookie match the cookieName
        if (c.indexOf(name) == 0) {
            // Return the cookies value
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isLoggedIn() {
    const token = getCookie('is_authenticated');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        return false;
    }
}

async function refreshAccessToken() {
    try {
        const response = await fetch('../includes/refresh-token.php', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
}

setInterval(async() => {
    if(isLoggedIn()) {
        const token = getCookie('is_authenticated');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const timeUntilExpiry = payload.exp * 1000 - Date.now();
        
        // Refresh 5 minutes before expiry
        if (timeUntilExpiry < 5 * 60 * 1000) {
            await refreshAccessToken();
        }
    }
}, 60000)