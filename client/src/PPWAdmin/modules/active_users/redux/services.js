import AdminAPI from "../../../redux/adminAPI";

export function getActiveUsers(count = 25) {
    return AdminAPI.get(`/active-user`, { params: { count } });
}

export function getActiveUsersCSV(count = 25) {
    return AdminAPI.get(`/active-user-csv`, { params: { count } });
}
