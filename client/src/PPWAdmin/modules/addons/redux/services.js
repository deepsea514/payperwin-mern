import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function getAddon(name) {
    return axios.get(`${serverUrl}/addons/${name}`);
}

export function setAddon(name, value) {
    return axios.put(`${serverUrl}/addons/${name}`, value);
}