const express = require('express');
const router = express.Router();

const RootController = require('../controller/RootController.controller');
const { verifyToken, verifyTokenAndCheckRole } = require('../middleware/verify-token.middleware');

router.put('/employee/:employeeID', verifyTokenAndCheckRole(['root']), RootController.updateEmployeeInfo);
router.delete('/employee/:employeeID', verifyTokenAndCheckRole(['root']), RootController.deleteEmployee);
router.get('/employee/search', verifyTokenAndCheckRole(['root']), RootController.searchEmployeeByEmailOrName);
router.get('/employee/:employeeID', verifyTokenAndCheckRole(['root']), RootController.getEmployeeInfo);
router.get('/employee', verifyTokenAndCheckRole(['root']), RootController.getAllEmployeeInfo);

module.exports = router;