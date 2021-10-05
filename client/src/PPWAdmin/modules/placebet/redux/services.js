import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function createPlaceBet(data) {
    return axios.post(`${serverUrl}/autobet`, data, { withCredentials: true });
}

export function getPlaceBets(page) {
    let url = `${serverUrl}/autobet?page=${page}`;
    return axios.get(url, {
        withCredentials: true
    });
}


export function searchAutoBetUsers(data) {
    let url = `${serverUrl}/seacrhautobets?name=${data}`;
    return axios.get(url, {
        withCredentials:true
    })
}

export function updatePlaceBet(id, data) {
    return axios.patch(`${serverUrl}/autobet/${id}`, data, { withCredentials: true });
}

export function deletePlaceBet(id) {
    return axios.delete(`${serverUrl}/autobet/${id}`, { withCredentials: true });
}
