import Cookies from 'js-cookie';

export function getAuthToken() {

    let token = null;

    // check if there is a auth_token in localStorage
    const authToken = window.localStorage.getItem('auth_token');

    // if not check if there is a token in localStorage
    const tokenFromLocalStorage = window.localStorage.getItem('token');

    // if not check if there is a accessToken in localStorage
    const accessToken = window.localStorage.getItem('accessToken');

    // check in cookies if there is a token
    const tokenFromCookies = Cookies.get('token');

    // check if there is a token in the url
    const urlSearch = new URLSearchParams(window.location.search);

    const tokenFromUrl = urlSearch.get('access_token');

    if (tokenFromUrl) {
        token = tokenFromUrl;
    }

    const tokenFromUrl2 = urlSearch.get('accessToken');

    if (tokenFromUrl2) {
        token = tokenFromUrl2;
    }

    if (authToken) {
        token = authToken;
    } else if (tokenFromLocalStorage) {
        token = tokenFromLocalStorage;
    } else if (tokenFromCookies) {
        token = tokenFromCookies;
    } else if (accessToken) {
        token = accessToken;
    }

    return token;
}

export function removeAuthToken() {
    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('accessToken');
    Cookies.remove('token');
}

export function setAuthToken(token) {
    window.localStorage.setItem('auth_token', token);
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('accessToken', token);
    Cookies.set('token', token);
}