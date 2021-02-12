import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function getBetActivities(page, filter, perPage = null) {
    let url = `${serverUrl}/bets?page=${page}`;
    if (perPage) url += `&perPage=${perPage}`;
    const { datefrom, dateto, sport, status, minamount, maxamount, house, match } = filter;
    if (datefrom && datefrom != '') url += `&datefrom=${encodeURIComponent(new Date(datefrom).toISOString())}`;
    if (dateto && dateto != '') url += `&dateto=${encodeURIComponent(new Date(dateto).toISOString())}`;
    if (sport && sport != '') url += `&sport=${encodeURIComponent(sport)}`;
    if (status && status != '') url += `&status=${encodeURIComponent(status)}`;
    if (minamount && minamount != '') url += `&minamount=${encodeURIComponent(minamount)}`;
    if (maxamount && maxamount != '') url += `&maxamount=${encodeURIComponent(maxamount)}`;
    if (house && house != '') url += `&house=${encodeURIComponent(house)}`;
    if (match && match != '') url += `&match=${encodeURIComponent(match)}`;

    return axios.get(url, { withCredentials: true });
}

export function getBetDetail(id) {
    return axios.get(`${serverUrl}/bet?id=${id}`, { withCredentials: true });
}

export function getSports() {
    return axios.get(`${serverUrl}/sports`, { withCredentials: true });
}