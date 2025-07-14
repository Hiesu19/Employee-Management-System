const express = require('express');
const router = express.Router();

const ReportController = require('../controller/ReportController.controller');
const { verifyTokenAndCheckRole } = require('../middleware/verify-token.middleware');

router.get('/export/employee-in-department', verifyTokenAndCheckRole(['manager']), ReportController.getAllEmployeeInDepartment);
router.get('/export/employee-in-company', verifyTokenAndCheckRole(['root']), ReportController.getAllEmployeeInCompany);

module.exports = router;