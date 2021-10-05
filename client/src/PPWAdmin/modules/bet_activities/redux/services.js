import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getBetActivities(page, filter, perPage = null) {
    let url = `${serverUrl}/bets?page=${page}`;
    if (perPage) url += `&perPage=${perPage}`;
    const { datefrom, dateto, sport, status, minamount, maxamount, house, match } = filter;
    if (datefrom) url += `&datefrom=${encodeURIComponent(new Date(datefrom).toISOString())}`;
    if (dateto) url += `&dateto=${encodeURIComponent(new Date(dateto).toISOString())}`;
    if (sport) url += `&sport=${encodeURIComponent(sport)}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    if (minamount) url += `&minamount=${encodeURIComponent(minamount)}`;
    if (maxamount) url += `&maxamount=${encodeURIComponent(maxamount)}`;
    if (house) url += `&house=${encodeURIComponent(house)}`;
    if (match) url += `&match=${encodeURIComponent(match)}`;

    return axios.get(url, { withCredentials: true });
}

export function getBetDetail(id) {
    return axios.get(`${serverUrl}/bet?id=${id}`, { withCredentials: true });
}

export function getSports() {
    return axios.get(`${serverUrl}/sports`, { withCredentials: true });
}

export function getWagerActivityAsCSV(filter) {
    let url = `${serverUrl}/bets-csv?format=csv`;
    const { datefrom, dateto, sport, minamount, maxamount } = filter;
    if (datefrom) url += `&datefrom=${encodeURIComponent(new Date(datefrom).toISOString())}`;
    if (dateto) url += `&dateto=${encodeURIComponent(new Date(dateto).toISOString())}`;
    if (sport) url += `&sport=${encodeURIComponent(sport)}`;
    if (minamount) url += `&minamount=${encodeURIComponent(minamount)}`;
    if (maxamount) url += `&maxamount=${encodeURIComponent(maxamount)}`;

    return axios.get(url, { withCredentials: true });
}

export function deleteBet(id) {
    return axios.delete(`${serverUrl}/bets/${id}`);
}

export function settleBet(id, score) {
    return axios.post(`${serverUrl}/bets/${id}/settle`, score);
}

export function matchBet(id, data) {
    return axios.post(`${serverUrl}/bets/${id}/match`, data);
}