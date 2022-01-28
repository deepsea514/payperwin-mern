import AdminAPI from "../../../redux/adminAPI";

export function getMembers() {
    return AdminAPI.get('/teams');
}

export function getMember(member_id) {
    return AdminAPI.get(`/teams/${member_id}`);
}

export function createMember(data) {
    return AdminAPI.post('/teams', data);
}

export function updateMember(member_id, data) {
    return AdminAPI.put(`/teams/${member_id}`, data);
}

export function deleteMember(member_id) {
    return AdminAPI.delete(`/teams/${member_id}`);
}