import AdminAPI from "../../../redux/adminAPI";

export function getVerifications(page, perPage = null) {
    const params = { page };
    if (perPage) params.perPage = perPage;
    return AdminAPI.get('/verifications', { params });
}

export function getVerificationImage(user_id, name) {
    return AdminAPI.post(`/verification-image`, { user_id, name });
}

export function acceptVerification(user_id) {
    return AdminAPI.post(`/verification-accept`, { user_id, });
}

export function declineVerification(user_id) {
    return AdminAPI.post(`/verification-decline`, { user_id, });
}