import axios from "axios";
import dateformat from 'dateformat';
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getDashboardData(range) {
    if (!range) range = 'today';
    let dateranges = [];
    let categories = [];
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth();
    const date = nowDate.getDate();
    switch (range) {
        case 'today':
            for (let i = 0; i <= 24; i += 2) {
                let ndate = new Date(year, month, date, i);
                dateranges.push(ndate);
                categories.push(dateformat(ndate, "HH:MM"));
            }
            break;
        case 'yesterday':
            for (let i = 0; i <= 24; i += 2) {
                let ndate = new Date(year, month, date - 1, i);
                dateranges.push(ndate);
                categories.push(dateformat(ndate, "HH:MM"));
            }
            break;
        case 'last7days':
            for (let i = 0; i <= 7; i++) {
                let ndate = new Date(year, month, date + i - 7)
                dateranges.push(ndate);
                categories.push(dateformat(ndate, "mmm d"));
            }
            break;
        case 'last30days':
            for (let i = 0; i <= 30; i++) {
                let ndate = new Date(year, month, date + i - 30);
                dateranges.push(ndate);
                categories.push(dateformat(ndate, "mmm d"));
            }
            break;
        case 'thismonth':
            for (let i = 0; i <= date; i++) {
                let ndate = new Date(year, month, i);
                dateranges.push(ndate);
                categories.push(dateformat(ndate, "mmm d"));
            }
            break;
        case 'lastmonth':
            let limit = new Date(year, month, 0);
            for (let i = 0; i <= 31; i++) {
                let ndate = new Date(year, month - 1, i);
                dateranges.push(ndate);
                categories.push(dateformat(ndate, "mmm d"));
                if (ndate.getTime() >= limit.getTime())
                    break;
            }
            break;
        case 'thisyear':
        default:
            for (let i = 0; i <= 12; i++) {
                let ndate = new Date(year, i, 1);
                dateranges.push(ndate);
                categories.push(dateformat(ndate, "mmmm"));
            }
            break;
    };
    return axios.post(`${serverUrl}/dashboard`,
        { range, dateranges, categories },
        {
            withCredentials: true
        });
}

export function getBots() {
    return axios.get(`${serverUrl}/autobets/overview`);
}