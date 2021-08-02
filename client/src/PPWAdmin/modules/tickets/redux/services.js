import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function getTickets(page, status) {
    let url = `${serverUrl}/tickets?page=${page}&status=${status}`;
    return axios.get(url, { withCredentials: true });
}

export function getTicketDetail(id) {
    let url = `${serverUrl}/ticket/${id}`;
    return axios.get(url, { withCredentials: true });
}

export function replyTicket(id, data) {
    let url = `${serverUrl}/replyticket/${id}`;
    return axios.post(url, data, { withCredentials: true });
}

export function archiveTicket(id, data) {
    let url = `${serverUrl}/ticket/${id}`;
    return axios.delete(url, { withCredentials: true });
}