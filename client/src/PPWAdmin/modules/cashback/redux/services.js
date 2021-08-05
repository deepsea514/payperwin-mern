import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appAdminUrl;

export function getCashback(page, filter) {
    let url = `${serverUrl}/cashback`;
    const { year, month } = filter;
    return axios.get(url, { params: { page, year, month } });
}

export function getLossHistory(user_id, year, month) {
    return axios.get(`${serverUrl}/cashback/${user_id}/${year}/${month}`);
}