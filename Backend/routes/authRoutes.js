const express = require('express');
const { register, registerAdmin, login, forgotPasswordHandler, resetPasswordHandler } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password', resetPasswordHandler);

module.exports = router;
