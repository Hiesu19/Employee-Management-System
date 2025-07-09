const express = require('express');
const router = express.Router();

const AuthController = require('../controller/AuthController.controller');
const { verifyToken, verifyTokenAndCheckRole } = require('../middleware/verify-token.middleware');

router.post('/login', AuthController.login);
router.post('/register', verifyTokenAndCheckRole(['root']), AuthController.register);
router.post('/refresh-token', verifyToken, AuthController.refreshToken);
router.post('/logout', verifyToken, AuthController.logout);

module.exports = router;