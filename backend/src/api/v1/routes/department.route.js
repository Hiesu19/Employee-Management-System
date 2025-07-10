const express = require('express');
const router = express.Router();

const DepartmentController = require('../controller/DepartmentController.controller');
const { verifyToken, verifyTokenAndCheckRole } = require('../middleware/verify-token.middleware');


router.post('/add-department', verifyTokenAndCheckRole(['root']), DepartmentController.createDepartment);
router.get('/', verifyTokenAndCheckRole(['root']), DepartmentController.getDepartments);
router.put('/:departmentID', verifyTokenAndCheckRole(['root']), DepartmentController.updateDepartmentInfo);
router.delete('/:departmentID', verifyTokenAndCheckRole(['root']), DepartmentController.deleteDepartment);

module.exports = router;