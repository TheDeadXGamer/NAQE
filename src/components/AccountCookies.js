function checkLogin(username, password) {
    let loginCookie = getCookie('username');
    if (loginCookie && loginCookie.username === username && loginCookie.password === password) {
        console.log("Login successful!");
        return true;
    }
    console.log("Login failed!");
    return false;
}

function getCookie(cname) {
    let name = `${cname}=`;
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.startsWith(name)) {
            let value = c.substring(name.length);
            let [username, password] = value.split(',password=');
            return { username, password };
        }
    }
    return null; // Return null if no cookie is found
}

function setCookie(cname, cpass) {
    let d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year expiration
    let expires = `expires=${d.toUTCString()}`;
    document.cookie = `username=${cname},password=${cpass};${expires};path=/;SameSite=Strict`;
    console.log(document.cookie); // Log the cookie for debugging
}

function setFavorites(username, favorites) {
    localStorage.setItem(`${username}_favorites`, JSON.stringify(favorites));
    console.log(`Favorites for ${username} stored in localStorage.`);
}

function getFavorites(username) {
    const favorites = localStorage.getItem(`${username}_favorites`);
    return favorites ? JSON.parse(favorites) : [];
}

export { setCookie, getCookie, checkLogin, setFavorites, getFavorites };
export default checkLogin;