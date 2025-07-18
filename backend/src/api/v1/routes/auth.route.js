const express = require('express');
const router = express.Router();

const AuthController = require('../controller/AuthController.controller');
const { verifyToken, verifyTokenAndCheckRole } = require('../middleware/verify-token.middleware');

// POST login
router.post('/login', AuthController.login);

// POST register. Chỉ root có quyền tạo user
router.post('/register', verifyTokenAndCheckRole(['root']), AuthController.register);

// POST refresh-token.
router.post('/refresh-token', verifyToken, AuthController.refreshToken);

// POST logout.
router.post('/logout', verifyToken, AuthController.logout);

// POST change-password.
router.post('/change-password', verifyToken, AuthController.changePassword);

module.exports = router;