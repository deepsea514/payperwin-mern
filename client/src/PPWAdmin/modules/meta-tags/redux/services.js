import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function getMetaTagDetail(title) {
    return axios.get(`${serverUrl}/meta/${title}`);
}

export function updateMetaTagDetail(title, data) {
    return axios.put(`${serverUrl}/meta/${title}`, data);
}