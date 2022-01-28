import AdminAPI from "../../../redux/adminAPI";

export function getMembers() {
    return AdminAPI.get('/members');
}

export function getMember(member_id) {
    return AdminAPI.get(`/members/${member_id}`);
}

export function createMember(data) {
    return AdminAPI.post('/members', data);
}

export function updateMember(member_id, data) {
    return AdminAPI.patch(`/members/${member_id}`, data);
}

export function deleteMember(member_id) {
    return AdminAPI.delete(`/members/${member_id}`);
}