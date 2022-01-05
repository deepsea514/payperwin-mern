import AdminAPI from "../../../redux/adminAPI";

export function getFAQSubjects(page) {
    return AdminAPI.get(`/faq-subjects`, { params: { page } });
}

export function addFAQSubject(value) {
    return AdminAPI.post(`/faq-subjects`, value);
}

export function deleteFAQSubject(id) {
    return AdminAPI.delete(`/faq-subjects/${id}`);
}

export function getFAQSubjectDetail(id) {
    return AdminAPI.get(`/faq-subjects/${id}`);
}

export function addFAQItem(subjectid, item) {
    return AdminAPI.post(`/faq-subjects/${subjectid}/item`, item);
}

export function deleteFAQItem(subjectid, id) {
    return AdminAPI.delete(`/faq-subjects/${subjectid}/item/${id}`);
}

export function editFAQItem(id, value) {
    return AdminAPI.put(`/faq-subjects/item/${id}`, value);
}
