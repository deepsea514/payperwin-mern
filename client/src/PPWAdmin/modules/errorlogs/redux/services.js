import AdminAPI from "../../../redux/adminAPI";

export function getErrorLogs(page, name) {
    return AdminAPI.get(`/errorlogs`, { params: { page, name } });
}

export function deleteErrorLog(id) {
    return AdminAPI.delete(`/errorlogs/${id}`);
}