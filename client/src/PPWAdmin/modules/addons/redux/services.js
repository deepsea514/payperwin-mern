import AdminAPI from "../../../redux/adminAPI";

export function getAddon(name) {
    return AdminAPI.get(`/addons/${name}`);
}

export function setAddon(name, value) {
    return AdminAPI.put(`/addons/${name}`, value);
}