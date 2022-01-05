import AdminAPI from "../../../redux/adminAPI";

export function getGiftCards(page, filter) {
    return AdminAPI.get(`/gift-cards`, { params: { page, ...filter } });
}