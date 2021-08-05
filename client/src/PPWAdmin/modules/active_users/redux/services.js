import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appAdminUrl;

export function getActiveUsers(count = 25) {
    let url = `${serverUrl}/active-user?count=${count}`;

    return axios.get(url, { withCredentials: true });
}

export function getActiveUsersCSV(count = 25) {
    let url = `${serverUrl}/active-user-csv?count=${count}`;

    return axios.get(url, { withCredentials: true });
}
