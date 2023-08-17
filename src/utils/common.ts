import moment from 'moment';

export const getBaseUrl = () => {
    return process.env.BASE_URL!;
}

export const getMonsterCollectionAddress = () => {
    return process.env.MONSTER_COLLECTION_MINT_ADDRESS!;
}

export const getLootCollectionAddress = () => {
    return process.env.LOOT_COLLECTION_MINT_ADDRESS!;
}

export const getCraftableCollectionAddress = () => {
    return process.env.CRAFTABLE_COLLECTION_MINT_ADDRESS!;
}

// converts to day month year
export const convertToYearMonthDay = (date: string, initialFormat?: string) => {
    return moment(date, initialFormat).format('YYYY-MM-DD');
}

// returns human readable time format, eg. a day ago
export const convertToHumanReadable = (date: string, initialFormat?: string) => {
    return moment(date, initialFormat).fromNow();
}