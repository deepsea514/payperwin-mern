import AffiliateAPI from "./affiliateAPI";

export function getUser() {
    return AffiliateAPI.get('/user');
}

export function login(data) {
    return AffiliateAPI.post('/login', data);
}

export function getDetail() {
    return AffiliateAPI.get('/detail');
}