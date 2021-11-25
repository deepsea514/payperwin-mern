import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getGiftCards(page, filter) {
    return axios.get(`${serverUrl}/gift-cards`, { params: { page, ...filter } });
}