import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appAdminUrl;

export function createAutoBet(data) {
    return axios.post(`${serverUrl}/autobet`, data, { withCredentials: true });
}

export function getAutoBets(page) {
    let url = `${serverUrl}/autobets?page=${page}`;
    return axios.get(url, {
        withCredentials: true
    });
}

export function updateAutoBet(id, data) {
    return axios.patch(`${serverUrl}/autobet/${id}`, data, { withCredentials: true });
}

export function deleteAutoBet(id) {
    return axios.delete(`${serverUrl}/autobet/${id}`, { withCredentials: true });
}