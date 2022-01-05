import AdminAPI from "../../../redux/adminAPI";

export function getCashback(page, filter) {
    const { year, month } = filter;
    return AdminAPI.get(`/cashback`, { params: { page, year, month } });
}

export function getLossHistory(user_id, year, month) {
    return AdminAPI.get(`/cashback/${user_id}/${year}/${month}`);
}