import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function getAdmins(page, filter) {
    let url = `${serverUrl}/admins?page=${page}`;
    const { role } = filter;
    if (role && role != '') url += `&role=${role}`;
    return axios.get(url);
}

export function createAdmin(value) {
    return axios.post(`${serverUrl}/admins`, value);
}