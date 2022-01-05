import AdminAPI from "../../../redux/adminAPI";

export function addEvent(data) {
    return AdminAPI.post(`/events`, data);
}

export function getEvents(page, filter, perPage = null) {
    const params = { page };
    if (perPage) params.perPage = perPage;
    const { status } = filter;
    if (status && status != '') params.status = status;

    return AdminAPI.get("/events");
}

export function getEvent(id) {
    return AdminAPI.get(`/events/${id}`);
}

export function editEvent(id, data) {
    return AdminAPI.put(`/events/${id}`, data);
}

export function settleEvent(id, data) {
    return AdminAPI.post(`/events/${id}/settle`, data);
}

export function cancelEvent(id) {
    return AdminAPI.post(`/events/${id}/cancel`, {});
}