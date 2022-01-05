import AdminAPI from "../../../redux/adminAPI";

export function createAutoBet(data) {
    return AdminAPI.post(`/autobet`, data);
}

export function getAutoBets(page) {
    return AdminAPI.get('/autobets', { params: { page } });
}

export function updateAutoBet(id, data) {
    return AdminAPI.patch(`/autobet/${id}`, data);
}

export function deleteAutoBet(id) {
    return AdminAPI.delete(`/autobet/${id}`);
}