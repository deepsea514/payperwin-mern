import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getProfitReports(page, filter) {
    return axios.get(`${serverUrl}/profits`, { withCredentials: true, params: { page, ...filter } });
}

export function getProfitReportsCSV(filter) {
    return axios.get(`${serverUrl}/profits-csv`, { withCredentials: true, params: filter });
}
