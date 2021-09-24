import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getCashback(page, filter) {
    let url = `${serverUrl}/cashback`;
    const { year, month } = filter;
    return axios.get(url, { params: { page, year, month } });
}

export function getLossHistory(user_id, year, month) {
    return axios.get(`${serverUrl}/cashback/${user_id}/${year}/${month}`);
}