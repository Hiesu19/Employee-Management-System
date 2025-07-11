const express = require('express');
const router = express.Router();

const EmployeeController = require('../controller/Employee.controller');
const { verifyToken } = require('../middleware/verify-token.middleware');

router.get('/', verifyToken, EmployeeController.getMyInfo);
router.put('/', verifyToken, EmployeeController.updateMyInfo);

module.exports = router;