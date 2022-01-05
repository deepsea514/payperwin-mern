import AdminAPI from "../../../redux/adminAPI";

export function getTickets(page, status) {
    return AdminAPI.get('/tickets', { params: { page, status } });
}

export function getTicketDetail(id) {
    return AdminAPI.get(`/ticket/${id}`);
}

export function replyTicket(id, data) {
    return AdminAPI.post(`/replyticket/${id}`, data,);
}

export function archiveTicket(id, data) {
    return AdminAPI.delete(`/ticket/${id}`);
}