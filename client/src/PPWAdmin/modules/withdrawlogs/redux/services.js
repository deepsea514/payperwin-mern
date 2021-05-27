import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function getWithdrawLog(page, filter, perPage = null) {
    let url = `${serverUrl}/withdraw?page=${page}`;
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

export function updateWithdraw(id, data) {
    const _2fa_code = data._2fa_code;
    delete data._2fa_code;
    return axios.patch(`${serverUrl}/withdraw?_2fa_code=${_2fa_code}`, { id, _2fa_code, data }, { withCredentials: true });
}

export function deleteWithdraw(id) {
    return axios.delete(`${serverUrl}/withdraw?id=${id}`, { withCredentials: true });
}

export function addWithdraw(data) {
    const _2fa_code = data._2fa_code;
    delete data._2fa_code;
    return axios.post(`${serverUrl}/withdraw?_2fa_code=${_2fa_code}`, data, { withCredentials: true });
}