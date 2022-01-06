import AdminAPI from "../../../redux/adminAPI";

export function createArticle(value) {
    return AdminAPI.post(`/articles`, value);
}

export function getArticleDrafts(page, filter) {
    const params = { page };
    if (filter.status) {
        params.status = filter.status;
    }
    return AdminAPI.get('/articles', { params });
}

export function getArticleDraft(id) {
    return AdminAPI.get(`/articles/${id}`);
}

export function deleteArticle(id) {
    return AdminAPI.delete(`/articles/${id}`);
}

export function updateArticle(id, data) {
    return AdminAPI.put(`/articles/${id}`, data);
}

export function getCategories() {
    return AdminAPI.get(`/articles/categories`);
}

export function searchCategories(name) {
    return AdminAPI.get(`/articles/searchcategories`, { params: { name } });
}

export function createCategory(data) {
    return AdminAPI.post(`/articles/categories`, data);
}

export function deleteCategory(id) {
    return AdminAPI.delete(`/articles/categories/${id}`);
}