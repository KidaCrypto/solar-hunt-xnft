import moment from 'moment';

export const getBaseUrl = () => {
    return process.env.BASE_URL!;
}

// export const getMonsterCollectionAddress = () => {
//     return process.env.MONSTER_COLLECTION_MINT_ADDRESS!;
// }

// export const getLootCollectionAddress = () => {
//     return process.env.LOOT_COLLECTION_MINT_ADDRESS!;
// }

// export const getCraftableCollectionAddress = () => {
//     return process.env.CRAFTABLE_COLLECTION_MINT_ADDRESS!;
// }

// converts to day month year
export const convertToYearMonthDay = (date: string, initialFormat?: string) => {
    return moment(date, initialFormat).format('YYYY-MM-DD');
}

// returns human readable time format, eg. a day ago
export const convertToHumanReadable = (date: string, initialFormat?: string) => {
    return moment(date, initialFormat).fromNow();
}

/**
 * Returns the number with 'en' locale settings, ie 1,000
 * @param x number
 * @param minDecimal number
 * @param maxDecimal number
 */
export function toLocaleDecimal(x: number, minDecimal: number, maxDecimal: number) {
    return x.toLocaleString('en', {
        minimumFractionDigits: minDecimal,
        maximumFractionDigits: maxDecimal,
    });
}

/**
 * Runs the function if it's a function, returns the result or undefined
 * @param fn
 * @param args
 */
export const runIfFunction = (fn: any, ...args: any): any | undefined => {
    if(typeof(fn) == 'function'){
        return fn(...args);
    }

    return undefined;
}