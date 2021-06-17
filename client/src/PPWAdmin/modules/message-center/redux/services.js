import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function createMessage(value) {
    return axios.post(`${serverUrl}/messages`, value, { withCredentials: true });
}