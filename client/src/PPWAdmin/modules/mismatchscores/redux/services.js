import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getMismatchScores(page) {
    return axios.get(`${serverUrl}/mismatch-scores?page=${page}`);
}