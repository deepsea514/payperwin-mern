import AdminAPI from "../../../redux/adminAPI";

export function getAdmins(page, filter) {
    const { role } = filter;
    const params = { page };
    if (role && role != '') {
        params.role = role;
    }
    return AdminAPI.get('/admins', { params });
}

export function createAdmin(value) {
    return AdminAPI.post(`/admins`, value);
}

export function getAdmin(id) {
    return AdminAPI.get(`/admins/${id}`);
}

export function updateAdmin(id, data) {
    return AdminAPI.put(`/admins/${id}`, data);
}