import axios from "axios";
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getCustomers(page, filter) {
    return axios.get(`${serverUrl}/customers`, { params: { ...filter, page } });
}

export function getCustomerDetail(id) {
    return axios.get(`${serverUrl}/customer`, { params: { id } });
}

export function updateCustomer(id, data) {
    return axios.patch(`${serverUrl}/customer`, { id, data });
}

export function deleteCustomer(id) {
    return axios.delete(`${serverUrl}/customer`, { params: { id } })
}

export function getReason() {
    return axios.get(`${serverUrl}/depositreasons`)
}

export function searchUsers(name) {
    return axios.get(`${serverUrl}/searchusers?name=${name}`);
}

export function searchAutobetUsers(name) {
    return axios.get(`${serverUrl}/searchautobetusers?name=${name}`);
}

export function getCustomerOverview(id) {
    return axios.get(`${serverUrl}/customer-overview?id=${id}`);
}

export function getCustomerLoginHistory(id, page, perPage) {
    return axios.get(`${serverUrl}/customer-loginhistory?id=${id}&page=${page}&perPage=${perPage}`);
}

export function getCustomerDeposits(id, page, perPage) {
    return axios.get(`${serverUrl}/customer-deposits?id=${id}&page=${page}&perPage=${perPage}`);
}

export function getCustomerWithdraws(id, page, perPage) {
    return axios.get(`${serverUrl}/customer-withdraws?id=${id}&page=${page}&perPage=${perPage}`);
}

export function getCustomerTransactions(id, page, perPage) {
    return axios.get(`${serverUrl}/customer-transactions`, { params: { id, page, perPage } });
}


export function getCustomerBets(id, page, perPage, src = 'ppw') {
    return axios.get(`${serverUrl}/customer-bets?id=${id}&page=${page}&perPage=${perPage}&src=${src}`);
}

export function searchSports(name) {
    return axios.get(`${serverUrl}/searchsports?name=${name}`);
}

export function getCustomerPreference(id) {
    return axios.get(`${serverUrl}/customer-preference/${id}`);
}

export function updateCustomerPreference(id, data) {
    return axios.put(`${serverUrl}/customer-preference/${id}`, data);
}

export function suspendCustomer(id, suspended) {
    return axios.put(`${serverUrl}/customer/${id}/suspend`, { suspended });
}

export function getCustomerCredits(id, page) {
    return axios.get(`${serverUrl}/customer-credits`, { params: { id, page } });
}

export function verifyCustomer(id) {
    return axios.put(`${serverUrl}/customer/${id}/manualverification`);
}
