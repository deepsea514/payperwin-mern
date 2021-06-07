import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function addEvent(data) {
    return axios.post(`${serverUrl}/events`, data, { withCredentials: true });
}

export function getEvents(page, filter, perPage = null) {
    let url = `${serverUrl}/events?page=${page}`;
    if (perPage) url += `&perPage=${perPage}`;
    const { status } = filter;
    if (status && status != '') url += `&status=${encodeURIComponent(status)}`;

    return axios.get(url, { withCredentials: true });
}