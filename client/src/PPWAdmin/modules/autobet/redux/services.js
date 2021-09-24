import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

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