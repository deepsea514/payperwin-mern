import axios from "axios";
import dateformat from 'dateformat';
import _env from '../../../../env.json';
const serverUrl = _env.appAdminUrl;

export function getDashboardData(range, daterange) {
    const { startDate, endDate } = daterange;
    let dateranges = [];
    let categories = [];

    if (startDate.getDate() === endDate.getDate()) {
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
      while (theDate < endDate) {
        dateranges = [...dateranges, new Date(theDate)];
        theDate.setDate(theDate.getDate() + 1);
        categories.push(dateformat(theDate, "HH:MM"));
      }
      dateranges = [...dateranges, endDate];
    }

    return axios.post(`${serverUrl}/dashboard`,
        { daterange, dateranges, categories },
        {
            withCredentials: true
        });
}

export function getBots() {
    return axios.get(`${serverUrl}/autobets/overview`);
}