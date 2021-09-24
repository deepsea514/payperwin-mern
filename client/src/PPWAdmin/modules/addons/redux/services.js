import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getAddon(name) {
    return axios.get(`${serverUrl}/addons/${name}`);
}

export function setAddon(name, value) {
    return axios.put(`${serverUrl}/addons/${name}`, value);
}