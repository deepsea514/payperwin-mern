import AdminAPI from "../../../redux/adminAPI";

export function getEmailTemplates() {
    return AdminAPI.get(`/email-templates`);
}

export function getEmailTemplateDetail(title) {
    return AdminAPI.get(`/email-template/${title}`);
}

export function updateEmailTemplate(title, body) {
    return AdminAPI.post(`/email-template/${title}`, body);
}

export function createEmailTemplate(data) {
    return AdminAPI.post(`/email-template`, data);
}