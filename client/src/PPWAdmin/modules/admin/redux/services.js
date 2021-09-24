import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getAdmins(page, filter) {
    let url = `${serverUrl}/admins?page=${page}`;
    const { role } = filter;
    if (role && role != '') url += `&role=${role}`;
    return axios.get(url);
}

export function createAdmin(value) {
    return axios.post(`${serverUrl}/admins`, value);
}

export function getAdmin(id) {
    return axios.get(`${serverUrl}/admins/${id}`);
}

export function updateAdmin(id, data) {
    return axios.put(`${serverUrl}/admins/${id}`, data);
}