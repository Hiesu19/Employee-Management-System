const express = require('express');
const router = express.Router();

const EmployeeController = require('../controller/EmployeeController.controller');
const RequestController = require('../controller/RequestController.controller');
const { verifyToken, verifyTokenAndCheckRole } = require('../middleware/verify-token.middleware');
const upload = require('../middleware/upload.middleware');


router.get('/', verifyToken, EmployeeController.getMyInfo);
router.put('/', verifyToken, EmployeeController.updateMyInfo);
router.post('/avatar', verifyToken, upload.single('avatar'), EmployeeController.updateMyAvatar);
router.post('/check-in', verifyTokenAndCheckRole(['manager', 'employee']), EmployeeController.checkIn);
router.post('/check-out', verifyTokenAndCheckRole(['manager', 'employee']), EmployeeController.checkOut);
router.get('/check-in-out', verifyTokenAndCheckRole(['manager', 'employee']), EmployeeController.getMyCheckInOut);

router.post('/request', verifyTokenAndCheckRole(['manager', 'employee']), RequestController.createRequest);
router.get('/request', verifyTokenAndCheckRole(['manager', 'employee']), RequestController.getMyRequest);
router.put('/request/:requestID', verifyTokenAndCheckRole(['manager', 'employee']), RequestController.updateMyRequest);
router.delete('/request/:requestID', verifyTokenAndCheckRole(['manager', 'employee']), RequestController.deleteMyRequest);

router.get('/manager/my-department', verifyTokenAndCheckRole(['manager']), EmployeeController.getMyDepartment);

router.get('/manager/request', verifyTokenAndCheckRole(['manager']), RequestController.getAllRequestByManager);
router.put('/manager/request/:requestID', verifyTokenAndCheckRole(['manager']), RequestController.editStatusRequestByManager);

module.exports = router;