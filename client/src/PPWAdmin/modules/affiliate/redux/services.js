import AdminAPI from "../../../redux/adminAPI";

export function getAffiliates(page) {
    return AdminAPI.get('/affiliates', { params: { page } });
}

export function getAffiliate(id) {
    return AdminAPI.get('/affiliates/' + id);
}

export function getAffiliateDetail(id) {
    return AdminAPI.get('/affiliates/' + id + '/detail');
}

export function deleteAffiliate(id) {
    return AdminAPI.delete('/affiliates/' + id);
}

export function updateAffiliate(id, data) {
    return AdminAPI.put('/affiliates/' + id, data);
}

export function createAffiliate(data) {
    return AdminAPI.post('/affiliates', data);
}