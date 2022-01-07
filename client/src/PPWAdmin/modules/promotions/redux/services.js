import AdminAPI from "../../../redux/adminAPI";

export function createPromotion(data) {
    return AdminAPI.post(`/promotion`, data);
}

export function getPromotions(page) {
    return AdminAPI.get(`/promotions`, { params: { page } });
}

export function getPromotionDetail(id) {
    return AdminAPI.get(`/promotion/${id}`);
}

export function deletePromotion(id) {
    return AdminAPI.delete(`/promotion/${id}`);
}

export function updatePromotion(id, data) {
    return AdminAPI.patch(`/promotion/${id}`, data);
}

export function loadPromotionBanners() {
    return AdminAPI.get(`/promotions/banners`);
}

export function uploadPromotionBanner(formdata) {
    return AdminAPI.post(`/promotions/banners`, formdata, { headers: { 'content-type': 'multipart/form-data' } });
}

export function deletePromotionBanner(id) {
    return AdminAPI.delete(`/promotions/banners/${id}`);
}

export function updatePromotionBanner(id, data) {
    return AdminAPI.put(`/promotions/banners/${id}`, data);
}