import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appAdminUrl;

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

export function getEvent(id) {
    return axios.get(`${serverUrl}/events/${id}`, { withCredentials: true });
}

export function editEvent(id, data) {
    return axios.put(`${serverUrl}/events/${id}`, data, { withCredentials: true });
}

export function settleEvent(id, data) {
    return axios.post(`${serverUrl}/events/${id}/settle`, data, { withCredentials: true });
}

export function cancelEvent(id) {
    return axios.post(`${serverUrl}/events/${id}/cancel`, {}, { withCredentials: true });
}