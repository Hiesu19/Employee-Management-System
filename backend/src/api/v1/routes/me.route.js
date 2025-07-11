const express = require('express');
const router = express.Router();

const EmployeeController = require('../controller/Employee.controller');
const { verifyToken } = require('../middleware/verify-token.middleware');
const upload = require('../middleware/upload.middleware');


router.get('/', verifyToken, EmployeeController.getMyInfo);
router.put('/', verifyToken, EmployeeController.updateMyInfo);
router.post('/avatar', verifyToken, upload.single('avatar'), EmployeeController.updateMyAvatar);


module.exports = router;