import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getCredits(page) {
    return axios.get(`${serverUrl}/credits`, { params: { page } });
}

export function setCredit(data) {
    return axios.post(`${serverUrl}/credits`, data);
}

export function getCreditDetail(page, user_id) {
    return axios.get(`${serverUrl}/credits/${user_id}`, { params: { page } });
}