import { getFavorites, addFavorite, removeFavorite } from '../context/FavouritesContext';
import { Badplatser } from './havApi';


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

function saveFavorites(username) {
    const ids = getFavorites().map((item) => item.id); // Get favorite IDs from context
    localStorage.setItem(`${username}_favorites`, JSON.stringify(ids));
    console.log(`Favorites for ${username} saved to localStorage.`);
}

function retrieveFavorites(username) {
    const badplatser = new Badplatser();

    const storedIds = localStorage.getItem(`${username}_favorites`);
    let ids = [];
    try {
        ids = storedIds ? JSON.parse(storedIds) : [];
        if (!Array.isArray(ids)) {
            console.error(`Invalid data in localStorage for ${username}_favorites. Expected an array.`);
            ids = []; // Reset to an empty array if the data is invalid
        }
    } catch (error) {
        console.error(`Error parsing localStorage data for ${username}_favorites:`, error);
        ids = []; // Reset to an empty array if parsing fails
    }

    if (ids.length === 0) {
        console.log(`No favorites found for ${username}.`);
        return;
    }

    ids.forEach((id) => {
        badplatser.fetchBadplatsById(id)
            .then((data) => {
                const favorite = {
                    id: data.bathingWater.id,
                    name: data.bathingWater.name,
                    municipality: data.bathingWater.municipality.name,
                    position: data.bathingWater.samplingPointPosition,
                    stats: null,
                };

                // Fetch stats and add to the favorite
                badplatser.fetchResultsById(id)
                    .then((resultData) => {
                        favorite.stats = resultData.length > 0 ? resultData[0] : null;
                        console.log("add saved favorite:", favorite); // Log the resolved favorite
                        addFavorite(favorite); // Add the favorite to the context
                    })
                    .catch((error) => {
                        console.error(`Error fetching results for ID ${id}:`, error);
                        addFavorite(favorite); // Add the favorite without stats if fetching fails
                    });
            })
            .catch((error) => {
                console.error(`Error fetching badplats with ID ${id}:`, error);
            });
    });

    console.log(`Favorites for ${username} retrieved from localStorage.`);
}

export { setCookie, getCookie, checkLogin, saveFavorites, retrieveFavorites };
export default checkLogin;