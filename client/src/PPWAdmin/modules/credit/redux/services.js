import AdminAPI from "../../../redux/adminAPI";

export function getCredits(page) {
    return AdminAPI.get(`/credits`, { params: { page } });
}

export function setCredit(data) {
    return AdminAPI.post(`/credits`, data);
}

export function getCreditDetail(page, user_id) {
    return AdminAPI.get(`/credits/${user_id}`, { params: { page } });
}