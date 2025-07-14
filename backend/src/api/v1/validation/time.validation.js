const { ResponseError } = require('../error/ResponseError.error');

const checkTimeFromDateBeforeToDate = (fromDate, toDate) => {
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    if (fromDateObj.getTime() === toDateObj.getTime()) {
        throw new ResponseError(400, "From date and to date must be different");
    }
    if (fromDateObj.getTime() > toDateObj.getTime()) {
        throw new ResponseError(400, "From date must be before to date");
    }
    return true;
}

module.exports = { checkTimeFromDateBeforeToDate };