const express = require('express');
const router = express.Router();

const AuthController = require('../controller/AuthController.controller');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;