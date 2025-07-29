import axios from "./axios";


export const checkIn = async () => {
    try {
        const response = await axios.post("/me/check-in");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkOut = async () => {
    try {
        const response = await axios.post("/me/check-out");
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getMyCheckInOut = async (offset = 0, limit = 10, dateStart = null, dateEnd = null) => {
    try {
        const params = {
            offset,
            limit,
        };

        if (dateStart) {
            params.dateStart = dateStart;
        }
        if (dateEnd) {
            params.dateEnd = dateEnd;
        }

        const response = await axios.get("/me/check-in-out", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getWeeklyCheckInOutStatus = async () => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        const endOfWeek = new Date(today);

        // Get start of week (Monday)
        const dayOfWeek = today.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startOfWeek.setDate(today.getDate() - daysToMonday);

        // Get end of week (Sunday)
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };

        const response = await getMyCheckInOut(0, 50, formatDate(startOfWeek), formatDate(endOfWeek));

        const weeklyData = {};

        if (response.data && response.data.checkInOut) {
            response.data.checkInOut.forEach(record => {
                const recordDate = new Date(record.date);
                const dateKey = `${recordDate.getFullYear()}-${recordDate.getMonth() + 1}-${recordDate.getDate()}`;

                weeklyData[dateKey] = {
                    checkInStatus: record.checkInTime || false,
                    checkOutStatus: record.checkOutTime || false,
                    checkInTime: record.checkInTime,
                    checkOutTime: record.checkOutTime,
                    timeWork: record.timeWork || 0
                };
            });
        }

        return { data: weeklyData };
    } catch (error) {
        throw error;
    }
};
