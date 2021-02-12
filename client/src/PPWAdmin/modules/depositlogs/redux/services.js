import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function getDepositLog(page, filter, perPage = null) {
    let url = `${serverUrl}/deposit?page=${page}`;
    if (perPage) url += `&perPage=${perPage}`;
    const { datefrom, dateto, status, method, minamount, maxamount } = filter;
    if (datefrom && datefrom != '') url += `&datefrom=${encodeURIComponent(datefrom)}`;
    if (dateto && dateto != '') url += `&dateto=${encodeURIComponent(dateto)}`;
    if (status && status != '') url += `&status=${encodeURIComponent(status)}`;
    if (method && method != '') url += `&method=${encodeURIComponent(method)}`;
    if (minamount && minamount != '') url += `&minamount=${encodeURIComponent(minamount)}`;
    if (maxamount && maxamount != '') url += `&maxamount=${encodeURIComponent(maxamount)}`;

    return axios.get(url, { withCredentials: true });
}

export function updateDeposit(id, data) {
    return axios.patch(`${serverUrl}/deposit`, { id, data }, { withCredentials: true });
}

export function deleteDeposit(id) {
    return axios.delete(`${serverUrl}/deposit?id=${id}`, { withCredentials: true });
}

export function addDeposit(credit) {
    return axios.post(`${serverUrl}/deposit`, credit, { withCredentials: true });
}