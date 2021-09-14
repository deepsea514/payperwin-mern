import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appAdminUrl;

export function getErrorLogs(page, name) {
    return axios.get(`${serverUrl}/errorlogs`, { params: { page, name } });
}

export function deleteErrorLog(id) {
    return axios.delete(`${serverUrl}/errorlogs/${id}`);
}