import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getCredits(page) {
    return axios.get('/credits');
}