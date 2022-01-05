import AdminAPI from "../../../redux/adminAPI";

export function getMismatchScores(page) {
    return AdminAPI.get(`/mismatch-scores`, { params: { page } });
}