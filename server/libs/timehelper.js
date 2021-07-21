const dateformat = require("dateformat");

const offset = - (new Date()).getTimezoneOffset();
const absOffset = offset > 0 ? offset : -offset;
const offsetHour = Math.floor(absOffset / 60);
const offsetMin = absOffset % 60;
const defaultTimezone = (offset > 0 ? '+' : '-') + (offsetHour > 9 ? offsetHour : '0' + offsetHour) + ":" + (offsetMin > 9 ? offsetMin : '0' + offsetMin)

function getChangedTime(date, timezone) {
    const timezoneArr = timezone.split(':');
    const min = Number(timezoneArr[1]);
    const hour = Number(timezoneArr[0]);
    const offset = (hour * 60 + (hour > 0 ? min : -min)) * 60 * 1000;
    let time = date.getTime();
    const offsetLocal = date.getTimezoneOffset() * 60 * 1000;
    time += offsetLocal;
    time += offset;

    return time;
}

function convertTimeLineDate(date, timezone) {
    if (!timezone) timezone = defaultTimezone;
    const time = getChangedTime(date, timezone);
    return dateformat(new Date(time), "dddd, mmmm d, yyyy h:MM tt ") + `GMT ${timezone}`;
}

module.exports = {
    convertTimeLineDate,
};