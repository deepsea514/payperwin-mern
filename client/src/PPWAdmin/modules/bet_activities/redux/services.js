import AdminAPI from "../../../redux/adminAPI";

export function getBetActivities(page, filter, perPage = null) {
    return AdminAPI.get(`/bets`, { params: { page, perPage, ...filter } });
}

export function getBetDetail(id) {
    return AdminAPI.get(`/bet`, { params: { id } });
}
export function getSports() {
    return AdminAPI.get(`/sports`);
}

export function getWagerActivityAsCSV(filter) {
    return AdminAPI.get(`/bets-csv`, { params: filter });
}
export function deleteBet(id) {
    return AdminAPI.delete(`/bets/${id}`);
}

export function cancelBet(id) {
    return AdminAPI.post(`/bets/${id}/cancel`);
}

export function settleBet(id, score) {
    return AdminAPI.post(`/bets/${id}/settle`, score);
}

export function matchBet(id, data) {
    return AdminAPI.post(`/bets/${id}/match`, data);
}

export function fixBetScore(id, score) {
    return AdminAPI.post(`/bets/${id}/fixscore`, score);
}

export function removeGame(id, cancelIds) {
    return AdminAPI.post(`/bets/${id}/remove`, { cancelIds });
}