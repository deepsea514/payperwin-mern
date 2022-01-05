import AdminAPI from "../../../redux/adminAPI";

export function getMetaTagDetail(title) {
    return AdminAPI.get(`/meta/${title}`);
}

export function updateMetaTagDetail(title, data) {
    return AdminAPI.put(`/meta/${title}`, data);
}