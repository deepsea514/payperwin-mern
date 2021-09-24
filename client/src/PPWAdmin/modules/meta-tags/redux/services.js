import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getMetaTagDetail(title) {
    return axios.get(`${serverUrl}/meta/${title}`);
}

export function updateMetaTagDetail(title, data) {
    return axios.put(`${serverUrl}/meta/${title}`, data);
}