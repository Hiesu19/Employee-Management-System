const { User, Department } = require('../models/index.model');
const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const { ResponseError } = require('../error/ResponseError.error');

const getAllEmployeeInDepartment = async (user) => {
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

module.exports = {
    getAllEmployeeInDepartment
}