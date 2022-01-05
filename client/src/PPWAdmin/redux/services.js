import AdminAPI from "./adminAPI";

export function getUser() {
    return AdminAPI.get('/user');
}

export function changePassword(values) {
    return AdminAPI.post(`/change-password`, values);
}

export function generateToken(values) {
    return AdminAPI.post(`/generateAuthCode`, values);
}

export function login(values) {
    return AdminAPI.post(`/login`, values)
}

export function verify2FA(values) {
    return AdminAPI.post(`/verify-2fa`, values)
}

export function resend2FA() {
    return AdminAPI.post(`/resend-2fa`, null)
}