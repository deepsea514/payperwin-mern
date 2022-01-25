import AffiliateAPI from "./affiliateAPI";

export function getUser() {
    return AffiliateAPI.get('/user');
}

export function login() {
    return AffiliateAPI.get('/login');
}
