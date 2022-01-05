import AdminAPI from "../../../redux/adminAPI";

export function createPlaceBet(data) {
    return AdminAPI.post(`/placeBets`, data);
}

export function getPlaceBets(page) {
    return AdminAPI.get('/placebetsbyadmin', { params: { page } });
}

export function searchSportsLeague(sportName) {
    return AdminAPI.get(`/searchsportsleague/${sportName}`);
}

export function searchAutoBetUsers(name) {
    return AdminAPI.get('/seacrhautobets', { params: { name } })
}

export function updatePlaceBet(id, data) {
    return AdminAPI.patch(`/autobet/${id}`, data);
}

export function deletePlaceBet(id) {
    return AdminAPI.delete(`/autobet/${id}`);
}
