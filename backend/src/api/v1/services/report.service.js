const { User, Department, CheckInOut } = require('../models/index.model');
const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const { ResponseError } = require('../error/ResponseError.error');

const exportAllEmployeeInDepartment = async (user) => {
    const departmentID = user.departmentID;

    if (!departmentID) {
        throw new ResponseError(400, "Manager is not assigned to any department");
    }

    const department = await Department.findOne({
        where: { departmentID: departmentID },
        attributes: ['departmentName']
    });

    const employeesInDepartment = await User.findAll({
        where: {
            role: { [Op.or]: ['employee', 'manager'] },
            departmentID: departmentID,
        },
        attributes: ['userID', 'fullName', 'email', 'phone', 'role', 'avatarURL', 'departmentID']
    });

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Nhan vien');
    worksheet.columns = [
        { header: 'User ID', key: 'userID' },
        { header: 'Họ và tên', key: 'fullName' },
        { header: 'Email', key: 'email' },
        { header: 'Số điện thoại', key: 'phone' },
        { header: 'Vai trò', key: 'role' },
        { header: 'Avatar', key: 'avatarURL' },
        { header: 'Phòng ban', key: 'departmentName' },
    ];

    employeesInDepartment.forEach(emp => {
        const empData = emp.toJSON();
        empData.departmentName = department ? department.departmentName : 'N/A';
        worksheet.addRow(empData);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

const exportAllEmployeeInCompany = async (user) => {
    const employeesInCompany = await User.findAll({
        where: {
            role: { [Op.or]: ['employee', 'manager'] },
        },
        attributes: ['userID', 'fullName', 'email', 'phone', 'role', 'avatarURL', 'departmentID'],
        include: [{
            model: Department,
            attributes: ['departmentName'],
        }]
    });


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Nhan vien');
    worksheet.columns = [
        { header: 'User ID', key: 'userID' },
        { header: 'Họ và tên', key: 'fullName' },
        { header: 'Email', key: 'email' },
        { header: 'Số điện thoại', key: 'phone' },
        { header: 'Vai trò', key: 'role' },
        { header: 'Avatar', key: 'avatarURL' },
        { header: 'Phòng ban', key: 'departmentName' },
    ];

    employeesInCompany.forEach(emp => {
        const empData = emp.toJSON();
        empData.departmentName = empData.Department ? empData.Department.departmentName : 'N/A';
        delete empData.Department;
        worksheet.addRow(empData);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

const calculateTotalTimeWorkedByMonth = async (manager, startDate, endDate) => {
    // Lấy danh sach nv
    const listEmployeeAtDepartment = await User.findAll({
        where: {
            departmentID: manager.departmentID,
            role: { [Op.or]: ['employee', 'manager'] }
        },
        attributes: ['userID', 'fullName', 'email', 'role']
    });

    const userIDs = listEmployeeAtDepartment.map(employee => employee.userID);

    let whereCondition = {
        userID: { [Op.in]: userIDs },
        checkOutTime: { [Op.not]: null }
    };

    if (startDate && endDate) {
        whereCondition.date = {
            [Op.between]: [startDate, endDate]
        };
    }
    
    //nếu chỉ có startDate thì lấy từ startDate đến hôm nay
    if (startDate && !endDate) {
        whereCondition.date = {
            [Op.gte]: startDate
        };
    }

    //nếu chỉ có endDate thì lấy từ quá khứ đến endDate 
    if (!startDate && endDate) {
        whereCondition.date = {
            [Op.lte]: endDate
        };
    }

    const listCheckInOuts = await CheckInOut.findAll({
        where: whereCondition,
        attributes: ['userID', 'checkInTime', 'checkOutTime', 'date'],
        order: [['date', 'ASC']]
    });

    const result = [];

    for (const employee of listEmployeeAtDepartment) {
        // Lọc lấy checkinout của nv đó
        const employeeCheckIns = listCheckInOuts.filter(record => record.userID === employee.userID);

        const workTimeByMonth = {};
        // Tính tổng thời gian làm trong tháng
        for (const record of employeeCheckIns) {
            const dateStr = record.date;

            const checkIn = new Date(`${dateStr}T${record.checkInTime}`);
            const checkOut = new Date(`${dateStr}T${record.checkOutTime}`);
            const workMinutes = Math.round((checkOut - checkIn) / (1000 * 60)); // tính phút

            // Lấy tháng năm
            const monthYear = dateStr.substring(0, 7);

            if (!workTimeByMonth[monthYear]) {
                workTimeByMonth[monthYear] = {
                    totalDays: 0,
                    totalMinutes: 0,
                };
            }

            //Tính
            workTimeByMonth[monthYear].totalMinutes += workMinutes;
            workTimeByMonth[monthYear].totalDays += 1;
        }

        result.push({
            userID: employee.userID,
            userFullName: employee.fullName,
            userEmail: employee.email,
            userRole: employee.role,
            workTimeAtMonth: workTimeByMonth
        });
    }

    return result;
}

const exportTotalTimeWorkedByMonth = async (manager, startDate, endDate) => {
    const datas = await calculateTotalTimeWorkedByMonth(manager, startDate, endDate);
    const workbook = new ExcelJS.Workbook();

    for (const data of datas) {
        const { userFullName, userEmail, userRole, workTimeAtMonth } = data;
        const worksheet = workbook.addWorksheet(userFullName.trim().split(' ').pop() + ' - ' + userEmail);

        // Tiêu đề
        worksheet.mergeCells('A1:C1');
        worksheet.getCell('A1').value = `Báo cáo thời gian từ ${startDate || "'quá khứ'"} đến ${endDate || "'nay'"}`;
        worksheet.getCell('A1').font = { bold: true };

        // Thông tin họ tên
        worksheet.mergeCells('A2:C2');
        worksheet.getCell('A2').value = `Họ tên: ${userFullName}`;

        // Thông tin email
        worksheet.mergeCells('A3:C3');
        worksheet.getCell('A3').value = `Email: ${userEmail}`;

        // role
        worksheet.mergeCells('A4:C4');
        worksheet.getCell('A4').value = `Vị trí: ${userRole === "manager" ? "Quản lý" : "Nhân viên"}`;

        //Tạo bảng 
        worksheet.addRow([]); // dòng trống
        worksheet.addRow(['Tháng', 'Số ngày đi làm', 'Số phút làm việc']);
        worksheet.getRow(5).font = { bold: true };

        const sortedMonths = Object.keys(workTimeAtMonth).sort();
        for (const month of sortedMonths) {
            const { totalDays, totalMinutes } = workTimeAtMonth[month];
            worksheet.addRow([month, totalDays, totalMinutes]);
        }

        worksheet.columns.forEach(column => column.width = 18);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

module.exports = {
    exportAllEmployeeInDepartment,
    exportAllEmployeeInCompany,
    exportTotalTimeWorkedByMonth
}