import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function createPromotion(data) {
    return axios.post(`${serverUrl}/promotion`, data, { withCredentials: true });
}

export function getPromotions(page) {
    return axios.get(`${serverUrl}/promotions?page=${page}`, { withCredentials: true });
}

export function getPromotionDetail(id) {
    return axios.get(`${serverUrl}/promotion/${id}`, { withCredentials: true });
}