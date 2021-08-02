import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[window.location.host].appAdminUrl;

export function getFrontendInfo(name) {
    return axios.get(`${serverUrl}/frontend/${name}`);
}

export function searchSports(name) {
    return axios.get(`${serverUrl}/searchsports?name=${name}`);
}

export function saveFrontendInfo(name, value) {
    return axios.put(`${serverUrl}/frontend/${name}`, value);
}