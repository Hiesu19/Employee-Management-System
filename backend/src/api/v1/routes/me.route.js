const express = require('express');
const router = express.Router();

const EmployeeController = require('../controller/Employee.controller');
const { verifyToken, verifyTokenAndCheckRole } = require('../middleware/verify-token.middleware');
const upload = require('../middleware/upload.middleware');


router.get('/', verifyToken, EmployeeController.getMyInfo);
router.put('/', verifyToken, EmployeeController.updateMyInfo);
router.post('/avatar', verifyToken, upload.single('avatar'), EmployeeController.updateMyAvatar);
router.post('/check-in', verifyTokenAndCheckRole(['manager', 'employee']), EmployeeController.checkIn);
router.post('/check-out', verifyTokenAndCheckRole(['manager', 'employee']), EmployeeController.checkOut);
router.get('/check-in-out', verifyTokenAndCheckRole(['manager', 'employee']), EmployeeController.getMyCheckInOut);

module.exports = router;