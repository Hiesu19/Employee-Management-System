const express = require('express');
const router = express.Router();

const RootController = require('../controller/RootController.controller');
const RequestController = require('../controller/RequestController.controller');
const { verifyToken, verifyTokenAndCheckRole } = require('../middleware/verify-token.middleware');
const upload = require('../middleware/upload.middleware');


router.put('/employee/reset-password', verifyTokenAndCheckRole(['root']), RootController.resetPassword);
router.put('/employee/change-department', verifyTokenAndCheckRole(['root']), RootController.changeDepartment);
router.put('/employee/change-role', verifyTokenAndCheckRole(['root']), RootController.changeRole);

router.get('/employee', verifyTokenAndCheckRole(['root']), RootController.getAllEmployeeInfo);
router.get('/employee/search', verifyTokenAndCheckRole(['root']), RootController.searchEmployeeByEmailOrName);
router.get('/employee/:employeeID', verifyTokenAndCheckRole(['root']), RootController.getEmployeeInfo);
router.put('/employee/:employeeID', verifyTokenAndCheckRole(['root']), RootController.updateEmployeeInfo);
router.post('/employee/:employeeID/avatar', verifyTokenAndCheckRole(['root']), upload.single('avatar'), RootController.updateEmployeeAvatar);
router.delete('/employee/:employeeID', verifyTokenAndCheckRole(['root']), RootController.deleteEmployee);

router.get('/request', verifyTokenAndCheckRole(['root']), RequestController.getAllRequestByRoot);
router.get('/request/total', verifyTokenAndCheckRole(['root']), RequestController.getTotalRequestByRoot);
router.put('/request/:requestID', verifyTokenAndCheckRole(['root']), RequestController.editStatusRequestByRoot);

module.exports = router