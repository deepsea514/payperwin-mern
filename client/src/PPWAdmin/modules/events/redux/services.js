import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function addEvent(data) {
    return axios.post(`${serverUrl}/events`, data, { withCredentials: true });
}

export function getEvents(page, filter, perPage = null) {
    let url = `${serverUrl}/events?page=${page}`;
    if (perPage) url += `&perPage=${perPage}`;
    const { status, result } = filter;
    if (status && status != '') url += `&status=${encodeURIComponent(status)}`;
    if (result && result != '') url += `&result=${encodeURIComponent(result)}`;

    return axios.get(url, { withCredentials: true });
}