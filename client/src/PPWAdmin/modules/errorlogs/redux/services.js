import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getErrorLogs(page, name) {
    return axios.get(`${serverUrl}/errorlogs`, { params: { page, name } });
}

export function deleteErrorLog(id) {
    return axios.delete(`${serverUrl}/errorlogs/${id}`);
}