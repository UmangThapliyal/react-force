import moment from 'moment';
import 'moment-timezone';
import 'moment-duration-format';

// From: https://www.regextester.com/96683
const DateRegEx = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

// See http://stackoverflow.com/questions/33906033/regex-for-time-in-hhmm-am-pm-format
const TimeRegEx = /((1[0-2]|0[1-9]):([0-5][0-9]) ([AaPp][Mm]))/;

const DurationRegEx = /\d{2}:([0-5][0-9])/;

/**
 * Returns true if the two dates are equal, otherwise false
 * @param date1
 * @param date2
 */
function isEqual(date1: Date, date2: Date): boolean {
    return date1.getTime() === date2.getTime();
}

/**
 * Compares two dates as specified by the Array sort function
 * @param date1
 * @param date2
 */
function compare(date1: Date, date2: Date): number {
    if (date1 < date2) return -1;
    if (date1 > date2) return 1;
    return 0;
}

/**
 * Adjust the supplied date to the start of an hour
 */
function adjustToStartOfHour(date: Date, timezone: string): Date {
    return moment.tz(date, timezone).startOf('hour').toDate();
}

/**
 * Computes a date from a date part, a time part and a timezone
 * @param {string} datePart, ISO format e.g. 2019-12-25
 * @param {string} timePart, hh:mm (AM|am|PM|pm), e.g 12:15 AM
 * @param {string} timezone, e.g. America/New_York
 * @returns {Date} e.g. 2016-12-07T00:00:00.000Z
 *     returns null if datePart is empty
 *     throws if computed date is invalid
 */
function computeDate(
    datePart: string,
    timePart: string,
    timezone?: string
): Date {
    // Note: It is crucial to call moment.tz( ) instead of moment( ).tz( ).
    // This makes sure that the moment is constructed with the correct timezone.
    const m = timezone
        ? moment.tz(`${datePart} ${timePart}`, 'YYYY-MM-DD hh:mm A', timezone)
        : moment(`${datePart} ${timePart}`, 'YYYY-MM-DD hh:mm A');

    if (!m.isValid()) {
        throw new Error('Invalid date');
    }

    return m.toDate();
}

/**
 * @returns {string} e.g. Monday, January 1, 2016
 */
function dateToDayDate(date: Date, timezone?: string): string {
    const m = timezone ? moment(date).tz(timezone) : moment(date);
    return m.format('dddd, MMMM D, YYYY');
}

/**
 * @returns {string} e.g. Mon, Jan 1st, 2016 9:00 AM
 */
function dateToLongDateTimeStr(date: Date, timezone?: string): string {
    const m = timezone ? moment(date).tz(timezone) : moment(date);
    return m.format('ddd, MMM Do, YYYY h:mm A');
}

/**
 * @returns {string} e.g. Jan 1, 2016 9:00 AM (no leading zero on day)
 */
function dateToShortDateTimeStr(date: Date, timezone?: string): string {
    const m = timezone ? moment(date).tz(timezone) : moment(date);
    return m.format('MMM D, YYYY h:mm A');
}

/**
 * @returns {string} e.g. 9:00 AM
 */
function dateToTimeStr(date: Date, timezone?: string): string {
    const m = timezone ? moment(date).tz(timezone) : moment(date);
    return m.format('h:mm A');
}

/**
 * Converts a Date object to a time string with leading zeros
 * @returns {string} e.g. 09:00 AM
 */
function dateToFullTimeStr(date: Date, timezone?: string): string {
    const m = timezone ? moment(date).tz(timezone) : moment(date);
    return m.format('hh:mm A');
}

/**
 * Converts a Date object to a date only string in ISO 8601 format.
 * @returns {string} e.g. 2016-12-07
 */
function dateToISODateString(date: Date, timezone?: string): string {
    const m = timezone ? moment(date).tz(timezone) : moment(date);
    return m.format('YYYY-MM-DD');
}

/**
 * Converts a Date object to a date-time string in ISO 8601 format:
 *     YYYY-MM-DDTHH:mm:ss.sssZ
 * The timezone is always zero UTC offset, as denoted by the suffix "Z"
 * @returns {string} e.g. 2016-12-07T00:00:00.000Z
 */
function dateToISODateTimeString(date: Date): string {
    return date.toISOString();
}

/**
 * @returns {string} e.g. Jan 1, 2016 - Jan 2, 2016 (no leading zero on day)
 * if beg & end are on the same day then simply returns the first date
 */
function dateRangeToDateRangeString(
    beg: Date,
    end: Date,
    timezone?: string
): string {
    const fmt = 'MMM D, YYYY';
    const mBeg = timezone ? moment(beg).tz(timezone) : moment(beg);
    const mEnd = timezone ? moment(end).tz(timezone) : moment(end);
    return mBeg.isSame(mEnd, 'day')
        ? mBeg.format(fmt)
        : `${mBeg.format(fmt)} - ${mEnd.format(fmt)}`;
}

/**
 * @returns {string} e.g. Mon, Jan 1st, 2016 9:00 AM - 10:00 AM
 */
function dateRangeToLongTimeRangeString(
    beg: Date,
    end: Date,
    timezone?: string
): string {
    return `${dateToLongDateTimeStr(beg, timezone)} - ${dateToTimeStr(
        end,
        timezone
    )}`;
}

/**
 * @returns {string} e.g. 9:00 AM - 10:00 AM
 */
function dateRangeToShortTimeRangeString(
    beg: Date,
    end: Date,
    timezone?: string
): string {
    return `${dateToTimeStr(beg, timezone)} - ${dateToTimeStr(end, timezone)}`;
}

/**
 * @param timezone
 * @returns {string} GMT offset for the specified timezone, e.g. 'GMT-04:00'
 */
function gmtOffset(timezone: string): string {
    return `GMT${moment.tz(timezone).format('Z')}`;
}

/**
 * @returns {string} local timezone
 */
function guessLocalTz(): string {
    /* istanbul ignore next */
    return moment.tz.guess();
}

/**
 * @param {number} millis - duration in milliseconds
 * @returns {string} duration in 'hh:mm' format, e.g. 01:30
 */
function millisToDurationStr(millis: number): string {
    return moment.duration(millis).format('hh:mm', { trim: false });
}

/**
 * @param {number} millis - duration in milliseconds
 * @returns {string} duration in ISO 8601 format, e.g. PT1H30M
 */
function millisToISODuration(millis: number): string {
    return moment.duration(millis).toJSON();
}

/**
 * @param {string} durationStr - duration in formats acceptable to moment, e.g. PT1H30M (ISO 8601), 01:30
 * @returns {number} duration in milliseconds
 */
function durationStrToMillis(durationStr: string): number {
    return moment.duration(durationStr).asMilliseconds();
}

/**
 * @param timezone
 * @returns {Date} start of today in the specified timezone
 */
function startOfToday(timezone: string): Date {
    return moment().tz(timezone).startOf('day').toDate();
}

/**
 * @param timezone
 * @returns {string} timezone abbreviation for the specified timezone, e.g. 'EST'
 */
function tzAbbr(timezone: string): string {
    const abbr = moment.tz(timezone).format('z');

    // if abbr contains any alpha character return it otherwise return gmtOffset
    return RegExp('[a-zA-Z]').test(abbr) ? abbr : gmtOffset(timezone);
}

export const DateUtils = {
    DateRegEx,
    TimeRegEx,
    DurationRegEx,
    adjustToStartOfHour,
    compare,
    computeDate,
    dateToDayDate,
    dateToLongDateTimeStr,
    dateToShortDateTimeStr,
    dateToTimeStr,
    dateToFullTimeStr,
    dateToISODateString,
    dateToISODateTimeString,
    dateRangeToDateRangeString,
    dateRangeToLongTimeRangeString,
    dateRangeToShortTimeRangeString,
    isEqual,
    gmtOffset,
    guessLocalTz,
    millisToDurationStr,
    millisToISODuration,
    durationStrToMillis,
    startOfToday,
    tzAbbr,
};
