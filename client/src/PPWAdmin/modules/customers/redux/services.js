import AdminAPI from "../../../redux/adminAPI";

export function getCustomers(page, filter) {
    return AdminAPI.get(`/customers`, { params: { ...filter, page } });
}

export function getCustomerDetail(id) {
    return AdminAPI.get(`/customer`, { params: { id } });
}

export function updateCustomer(id, data) {
    return AdminAPI.patch(`/customer`, { id, data });
}

export function deleteCustomer(id) {
    return AdminAPI.delete(`/customer`, { params: { id } })
}

export function getReason() {
    return AdminAPI.get(`/depositreasons`)
}

export function searchUsers(name) {
    return AdminAPI.get(`/searchusers`, { params: { name } });
}

export function searchAutobetUsers(name) {
    return AdminAPI.get(`/searchautobetusers`, { params: { name } });
}

export function getCustomerOverview(id) {
    return AdminAPI.get(`/customer-overview`, { params: { id } });
}

export function getCustomerLoginHistory(id, page, perPage) {
    return AdminAPI.get(`/customer-loginhistory`, { params: { id, page, perPage } });
}

export function getCustomerDeposits(id, page, perPage) {
    return AdminAPI.get(`/customer-deposits`, { params: { id, page, perPage } });
}

export function getCustomerWithdraws(id, page, perPage) {
    return AdminAPI.get(`/customer-withdraws`, { params: { id, page, perPage } });
}

export function getCustomerTransactions(id, page, perPage) {
    return AdminAPI.get(`/customer-transactions`, { params: { id, page, perPage } });
}


export function getCustomerBets(id, page, perPage, src = 'ppw') {
    return AdminAPI.get(`/customer-bets`, { params: { id, page, perPage, src } });
}

export function searchSports(name) {
    return AdminAPI.get(`/searchsports`, { params: { name } });
}

export function getCustomerPreference(id) {
    return AdminAPI.get(`/customer-preference/${id}`);
}

export function updateCustomerPreference(id, data) {
    return AdminAPI.put(`/customer-preference/${id}`, data);
}

export function suspendCustomer(id, suspended) {
    return AdminAPI.put(`/customer/${id}/suspend`, { suspended });
}

export function getCustomerCredits(id, page) {
    return AdminAPI.get(`/customer-credits`, { params: { id, page } });
}

export function getCustomerReferrals(id, page) {
    return AdminAPI.get(`/customer-referrals`, { params: { id, page } });
}

export function verifyCustomer(id) {
    return AdminAPI.put(`/customer/${id}/manualverification`);
}
