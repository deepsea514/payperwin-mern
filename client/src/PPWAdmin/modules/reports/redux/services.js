import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appAdminUrl;

export function getProfitReports(page, filter) {
    return axios.get(`${serverUrl}/profits`, { withCredentials: true, params: { page, ...filter } });
}

export function getProfitReportsCSV(filter) {
    return axios.get(`${serverUrl}/profits-csv`, { withCredentials: true, params: filter });
}
