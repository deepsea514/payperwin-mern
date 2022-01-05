import AdminAPI from "../../../redux/adminAPI";

export function getProfitReports(page, filter) {
    return AdminAPI.get(`/profits`, { params: { page, ...filter } });
}

export function getProfitReportsCSV(filter) {
    return AdminAPI.get(`/profits-csv`, { params: filter });
}
