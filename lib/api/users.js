import client from "./client";

export function getLoggedInUser(params = {}) {
    return client.get(`/api/user`, { params });
}

export function loginUser(params = {}) {
    return client.post(`/api/login`, params);
}

export function sendMagicLink(email) {
    return client.post(`/api/send-login-by-email-link`, {
        email: email
    });
}

export function initiateEmailChange(userId, data) {
    return client.post(`/api/users/${userId}/initiate-email-change`, data);
}

export function confirmEmailChange(data) {
    return client.post(`/api/confirm-email-change`, data);
}