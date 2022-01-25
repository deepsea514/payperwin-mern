import AffiliateAPI from "./affiliateAPI";

export function getUser() {
    return AffiliateAPI.get('/user');
}
