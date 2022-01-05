import AdminAPI from "../../../redux/adminAPI";

export function getDepositLog(page, filter, perPage = null) {
    const params = { page };
    if (perPage) params.perPage = perPage;
    const { datefrom, dateto, status, method, minamount, maxamount } = filter;
    if (datefrom && datefrom != '') params.datefrom = datefrom;
    if (dateto && dateto != '') params.dateto = dateto;
    if (status && status != '') params.status = status;
    if (method && method != '') params.method = method;
    if (minamount && minamount != '') params.minamount = minamount;
    if (maxamount && maxamount != '') params.maxamount = maxamount;

    return AdminAPI.get(`/deposit`, { params });
}

export function updateDeposit(id, data) {
    return AdminAPI.patch(`/deposit`, { id, data });
}

export function deleteDeposit(id) {
    return AdminAPI.delete(`/deposit`, { params: { id } });
}

export function addDeposit(credit) {
    return AdminAPI.post(`/deposit`, credit);
}

export function getDepositLogAsCSV(filter) {
    const { datefrom, dateto } = filter;
    const params = {};
    if (datefrom && datefrom != '') params.datefrom = datefrom;
    if (dateto && dateto != '') params.dateto = dateto;

    return AdminAPI.get('/deposit-csv', { params });
}