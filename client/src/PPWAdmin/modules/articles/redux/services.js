import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function createArticle(value) {
    return axios.post(`${serverUrl}/articles`, value, { withCredentials: true });
}

export function getArticleDrafts(page, filter) {
    let url = `${serverUrl}/articles?page=${page}`;
    if (filter.status) {
        url += `&status=${filter.status}`;
    }
    return axios.get(url);
}

export function getArticleDraft(id) {
    return axios.get(`${serverUrl}/articles/${id}`);
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