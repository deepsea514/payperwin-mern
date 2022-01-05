import AdminAPI from "../../../redux/adminAPI";

export function createMessage(value) {
    return AdminAPI.post(`/messages`, value);
}

export function getMessageDrafts(page) {
    return AdminAPI.get(`/messages`, { params: { page } });
}

export function getMessageDraft(id) {
    return AdminAPI.get(`/messages/${id}`);
}

export function editMessageDraft(id, data) {
    return AdminAPI.put(`/messages/${id}`, data);
}

export function deleteMessageDraft(id) {
    return AdminAPI.delete(`/messages/${id}`);
}