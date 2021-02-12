import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function getDashboardData(range) {
    return axios.get(`${serverUrl}/dashboard?range=${range}`, {
        withCredentials: true
    });
}
