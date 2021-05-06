import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function getFAQSubjects(page) {
    return axios.get(`${serverUrl}/faq-subjects?page=${page}`, { withCredentials: true });
}

export function addFAQSubject(value) {
    return axios.post(`${serverUrl}/faq-subjects`, value, { withCredentials: true });
}

export function deleteFAQSubject(id) {
    return axios.delete(`${serverUrl}/faq-subjects/${id}`, { withCredentials: true });
}

export function getFAQSubjectDetail(id) {
    return axios.get(`${serverUrl}/faq-subjects/${id}`, { withCredentials: true });
}

export function addFAQItem(subjectid, item) {
    return axios.post(`${serverUrl}/faq-subjects/${subjectid}/item`, item, { withCredentials: true });
}

export function deleteFAQItem(subjectid, id) {
    return axios.delete(`${serverUrl}/faq-subjects/${subjectid}/item/${id}`, { withCredentials: true });
}

export function editFAQItem(id, value) {
    return axios.put(`${serverUrl}/faq-subjects/item/${id}`, value, { withCredentials: true });
}
