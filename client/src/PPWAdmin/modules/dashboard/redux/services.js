import dateformat from 'dateformat';
import AdminAPI from '../../../redux/adminAPI';

export function getDashboardData(daterange) {
    const { startDate, endDate, selected } = daterange;
    let dateranges = [];
    let categories = [];

    if (new Date(endDate).getTime() - new Date(startDate).getTime() <= 24 * 60 * 60 * 100) {
        const nowDate = new Date();
        const year = nowDate.getFullYear();
        const month = nowDate.getMonth();
        const date = nowDate.getDate();
        for (let i = 0; i <= 24; i += 2) {
            let ndate = new Date(year, month, date, i);
            dateranges.push(ndate);
            categories.push(dateformat(ndate, "HH:MM"));
        }
    } else {
        //to avoid modifying the original date
        const theDate = new Date(startDate);
        switch (selected) {
            case 'alltime':
            case 'thisyear':
                theDate.setDate(1);
                while (theDate.getTime() < new Date(endDate).getTime()) {
                    dateranges = [...dateranges, new Date(theDate)];
                    categories.push(dateformat(theDate, "yyyy mmm"));
                    theDate.setMonth(theDate.getMonth() + 1);
                }
                dateranges = [...dateranges, endDate];
                break;
            default:
                while (theDate.getTime() < new Date(endDate).getTime()) {
                    dateranges = [...dateranges, new Date(theDate)];
                    categories.push(dateformat(theDate, "mmm d"));
                    theDate.setDate(theDate.getDate() + 1);
                }
                dateranges = [...dateranges, endDate];
        }
    }

    return AdminAPI.post(`/dashboard`, { daterange, dateranges, categories });
}

export function getBots() {
    return AdminAPI.get(`/autobets/overview`);
}