import AdminAPI from "../../../redux/adminAPI";

export function getWithdrawLog(page, filter, perPage = null) {
    const params = { page };
    if (perPage) params.perPage = perPage;
    const { datefrom, dateto, status, method, minamount, maxamount } = filter;
    if (datefrom && datefrom != '') params.datefrom = datefrom;
    if (dateto && dateto != '') params.dateto = dateto;
    if (status && status != '') params.status = status;
    if (method && method != '') params.method = method;
    if (minamount && minamount != '') params.minamount = minamount;
    if (maxamount && maxamount != '') params.maxamount = maxamount;

    return AdminAPI.get('/withdraw', { params });
}

export function updateWithdraw(id, data) {
    const _2fa_code = data._2fa_code;
    delete data._2fa_code;
    let time = (new Date()).getTime();
    time = Math.floor(time / 1000);
    return AdminAPI.patch(`/withdraw`, { id, data }, { params: { _2fa_code, time } });
}

export function deleteWithdraw(id) {
    return AdminAPI.delete(`/withdraw`, { params: { id } });
}

export function addWithdraw(data) {
    let time = (new Date()).getTime();
    time = Math.floor(time / 1000);
    return AdminAPI.post(`/withdraw`, data);
}

export function getWithdrawLogAsCSV(filter) {
    const params = {};
    const { datefrom, dateto } = filter;
    if (datefrom && datefrom != '') params.datefrom = datefrom;
    if (dateto && dateto != '') params.dateto = dateto;

    return AdminAPI.get('/withdraw-csv', { params });
}