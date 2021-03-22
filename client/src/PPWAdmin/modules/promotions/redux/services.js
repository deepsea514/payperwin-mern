import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function createPromotion(data) {
    return axios.post(`${serverUrl}/promotion`, data, { withCredentials: true });
}

export function getPromotions(page) {
    return axios.get(`${serverUrl}/promotions?page=${page}`, { withCredentials: true });
}

export function getPromotionDetail(id) {
    return axios.get(`${serverUrl}/promotion/${id}`, { withCredentials: true });
}