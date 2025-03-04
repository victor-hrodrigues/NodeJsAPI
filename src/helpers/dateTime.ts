export const getDatetime = (): string => {
    const now = new Date();
    const saoPauloTime = convertToSaoPauloTime(now);
    const formattedDate = formatDate(saoPauloTime, 'log');
    const formattedTime = formatTime(saoPauloTime);

    return `${formattedDate} ${formattedTime}`;
}

export const getCurrentDate = () => {
    const now = new Date();
    return formatDate(now, 'file');
}

export function checkTimeDifference(fileBirthTime: Date): boolean {
    const creationDate = new Date(fileBirthTime);
    const currentDate = new Date();
    const timeDifferenceInMilliseconds: number = currentDate.getTime() - creationDate.getTime();
    const timeDifferenceInDays: number = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
    const result = timeDifferenceInDays > 15;
    return result;
}

const convertToSaoPauloTime = (date: Date): Date => {
    const offset = -3;
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const saoPauloTime = new Date(utc + (3600000 * offset));
    return saoPauloTime;
}

const formatDate = (date: Date, fileLog: string): string => {
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();

    if (fileLog === 'log') {
        return `${day}/${month}/${year}`;
    }
    return `${year}-${month}-${day}`
}

const formatTime = (date: Date): string => {
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());

    return `${hours}:${minutes}`;
}

const padZero = (value: number): string => {
    return value < 10 ? `0${value}` : value.toString();
}
