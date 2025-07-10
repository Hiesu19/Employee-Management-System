const express = require('express');
const router = express.Router();

const DepartmentController = require('../controller/DepartmentController.controller');
const { verifyToken, verifyTokenAndCheckRole } = require('../middleware/verify-token.middleware');


router.post('/add-department', verifyTokenAndCheckRole(['root']), DepartmentController.createDepartment);

module.exports = router;