import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getActiveUsers(count = 25) {
    let url = `${serverUrl}/active-user?count=${count}`;

    return axios.get(url, { withCredentials: true });
}

export function getActiveUsersCSV(count = 25) {
    let url = `${serverUrl}/active-user-csv?count=${count}`;

    return axios.get(url, { withCredentials: true });
}
