import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getBetActivities(page, filter, perPage = null) {
    return axios.get(`${serverUrl}/bets`, {
        withCredentials: true, params: {
            page, perPage, ...filter
        }
    });
}

export function getBetDetail(id) {
    return axios.get(`${serverUrl}/bet`, { withCredentials: true, params: { id } });
}

export function getSports() {
    return axios.get(`${serverUrl}/sports`, { withCredentials: true });
}

export function getWagerActivityAsCSV(filter) {
    return axios.get(`${serverUrl}/bets-csv`, { withCredentials: true, params: filter });
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