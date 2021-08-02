import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[window.location.host].appAdminUrl;

export function getEmailTemplates() {
    return axios.get(`${serverUrl}/email-templates`, { withCredentials: true });
}

export function getEmailTemplateDetail(title) {
    return axios.get(`${serverUrl}/email-template/${title}`, { withCredentials: true });
}

export function updateEmailTemplate(title, body) {
    return axios.post(`${serverUrl}/email-template/${title}`, body, { withCredentials: true });
}

export function createEmailTemplate(data) {
    return axios.post(`${serverUrl}/email-template`, data, { withCredentials: true });
}