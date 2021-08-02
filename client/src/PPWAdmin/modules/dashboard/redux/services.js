import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[window.location.host].appAdminUrl;

export function getDashboardData(range) {
    return axios.get(`${serverUrl}/dashboard?range=${range}`, {
        withCredentials: true
    });
}
