const dateformat = require("dateformat");
const config = require("../../../config.json");
const TimeZones = config.TimeZones;
const isDstObserved = config.isDstObserved;

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

function getDisplayModeBasedOnSystemTime(timezone) {
    timezone = TimeZones.find(time => time.value == timezone);
    if (!timezone) timezone = defaultTimezone;
    else {
        if (isDstObserved && timezone.dst) {
            timezone = getDSTTimeOffset(timezone.time);
        } else {
            timezone = timezone.time;
        }
    }
    const changedTime = new Date(getChangedTime(new Date(), timezone));
    const hour = changedTime.getHours();
    if (hour < 6 || hour >= 18) return 'dark';
    return 'light';
}

function convertTimeClock(date, timezone) {
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
    return dateformat(new Date(time), "HH:MM:ss ") + `GMT ${timezone}`;
}

function convertTimeEventDate(date, timezone) {
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
    return dateformat(new Date(time), "mm/dd/yyyy h:MM tt ");
}

function convertTimeLineDate(date, timezone) {
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
    return dateformat(new Date(time), "dddd, mmmm d, yyyy h:MM tt ");
}


function getDSTTimeOffset(offset) {
    const timezoneArr = offset.split(':');
    const min = Number(timezoneArr[1]);
    let hour = Number(timezoneArr[0]);
    hour += 1;
    let absHour = Math.abs(hour);
    return (hour >= 0 ? "+" : "-") + (absHour > 10 ? absHour : '0' + absHour) + ':' + (min == 0 ? "00" : min);
}

export default {
    convertTimeClock,
    convertTimeEventDate,
    convertTimeLineDate,
    getDSTTimeOffset,
    getDisplayModeBasedOnSystemTime
};