const dateformat = require("dateformat");
const config = require("../../config.json");
const TimeZones = config.TimeZones;
const isDstObserved = config.isDstObserved;

const offset = - (new Date()).getTimezoneOffset();
const absOffset = offset > 0 ? offset : -offset;
const offsetHour = Math.floor(absOffset / 60);
const offsetMin = absOffset % 60;
const defaultTimezone = (offset > 0 ? '+' : '-') + (offsetHour > 9 ? offsetHour : '0' + offsetHour) + ":" + (offsetMin > 9 ? offsetMin : '0' + offsetMin)

const getChangedTime = (date, timezone) => {
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

const convertTimeLineDate = (date, timezone) => {
    timezone = TimeZones.find(time => time.value == timezone);
    if (!timezone) timezone = defaultTimezone;
    else {
        if (isDstObserved && timezone.dst) {
            timezone = getDSTTimeOffset(timezone.time);
        } else {
            timezone = timezone.time;
        }
    }

    const time = getChangedTime(date, timezone);
    return dateformat(new Date(time), "dddd, mmmm d, yyyy h:MM tt ") + `GMT ${timezone}`;
}

const getDSTTimeOffset = (offset) => {
    const timezoneArr = offset.split(':');
    const min = Number(timezoneArr[1]);
    let hour = Number(timezoneArr[0]);
    hour += 1;
    let absHour = Math.abs(hour);
    return (hour >= 0 ? "+" : "-") + (absHour > 10 ? absHour : '0' + absHour) + ':' + (min == 0 ? "00" : min);
}

module.exports = {
    convertTimeLineDate,
    getDSTTimeOffset,
};