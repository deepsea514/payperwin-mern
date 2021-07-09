import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function createArticle(value) {
    return axios.post(`${serverUrl}/articles`, value, { withCredentials: true });
}

export function getArticleDrafts(page) {
    return axios.get(`${serverUrl}/articles/drafts?page=${page}`);
}

export function getArticleDraft(id) {
    return axios.get(`${serverUrl}/articles/drafts/${id}`);
}

export function deleteArticle(id) {
    return axios.delete(`${serverUrl}/articles/${id}`);
}

export function updateArticle(id, data) {
    return axios.put(`${serverUrl}/articles/${id}`, data);
}

export function getCategories() {
    return axios.get(`${serverUrl}/articles/categories`);
}

export function searchCategories(name) {
    return axios.get(`${serverUrl}/articles/searchcategories?name=${name}`);
}

export function createCategory(data) {
    return axios.post(`${serverUrl}/articles/categories`, data);
}

export function deleteCategory(id) {
    return axios.delete(`${serverUrl}/articles/categories/${id}`);
}