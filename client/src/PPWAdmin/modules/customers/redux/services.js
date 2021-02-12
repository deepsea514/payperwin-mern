import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.appAdminUrl;

export function getCustomers(page, filter) {
    let url = `${serverUrl}/customers?page=${page}`;
    const { name, email, balancemin, balancemax } = filter;
    if (name && name != '') url += `&name=${name}`;
    if (email && email != '') url += `&email=${email}`;
    if (balancemin && balancemin != '') url += `&balancemin=${balancemin}`;
    if (balancemax && balancemax != '') url += `&balancemax=${balancemax}`;
    return axios.get(url, {
        withCredentials: true
    });
}

export function getCustomerDetail(id) {
    return axios.get(`${serverUrl}/customer?id=${id}`, {
        withCredentials: true
    });
}

export function updateCustomer(id, data) {
    return axios.patch(`${serverUrl}/customer`, {
        id, data
    }, {
        withCredentials: true
    });
}

export function deleteCustomer(id) {
    return axios.delete(`${serverUrl}/customer?id=${id}`, {
        withCredentials: true
    })
}

export function getReason() {
    return axios.get(`${serverUrl}/depositreasons`, {
        withCredentials: true
    })
}

export function searchUsers(name) {
    return axios.get(`${serverUrl}/searchusers?name=${name}`);
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

export function getCustomerBets(id, page, perPage) {
    return axios.get(`${serverUrl}/customer-bets?id=${id}&page=${page}&perPage=${perPage}`);   
}