import moment from 'moment';

export const getBaseUrl = () => {
    return process.env.BASE_URL;
}

// converts to day month year
export const convertToYearMonthDay = (date: string, initialFormat?: string) => {
    return moment(date, initialFormat).format('YYYY-MM-DD');
}

// returns human readable time format, eg. a day ago
export const convertToHumanReadable = (date: string, initialFormat?: string) => {
    return moment(date, initialFormat).fromNow();
}