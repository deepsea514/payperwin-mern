import AdminAPI from "../../../redux/adminAPI";

export function getFrontendInfo(name) {
    return AdminAPI.get(`/frontend/${name}`);
}

export function searchSports(name) {
    return AdminAPI.get(`/searchsports`, { params: { name } });
}

export function saveFrontendInfo(name, value) {
    return AdminAPI.put(`/frontend/${name}`, value);
}