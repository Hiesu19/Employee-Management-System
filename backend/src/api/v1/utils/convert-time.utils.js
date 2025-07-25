
function convertToDDMMYYYY_HHMMSS_GMT7(dateInput) {
    let date;
    if (typeof dateInput === 'string') {
        date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        throw new Error('Invalid date input');
    }

    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const gmt7 = new Date(utc + (7 * 60 * 60000));

    const pad = (n) => n < 10 ? '0' + n : n;

    const day = pad(gmt7.getDate());
    const month = pad(gmt7.getMonth() + 1);
    const year = gmt7.getFullYear();
    const hours = pad(gmt7.getHours());
    const minutes = pad(gmt7.getMinutes());
    const seconds = pad(gmt7.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

module.exports = { convertToDDMMYYYY_HHMMSS_GMT7 };
