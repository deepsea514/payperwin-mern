import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[window.location.host].appAdminUrl;

export function createMessage(value) {
    return axios.post(`${serverUrl}/messages`, value, { withCredentials: true });
}

export function getMessageDrafts(page) {
    return axios.get(`${serverUrl}/messages?page=${page}`);
}

export function getMessageDraft(id) {
    return axios.get(`${serverUrl}/messages/${id}`);
}

export function editMessageDraft(id, data) {
    return axios.put(`${serverUrl}/messages/${id}`, data);
}

export function deleteMessageDraft(id) {
    return axios.delete(`${serverUrl}/messages/${id}`);
}