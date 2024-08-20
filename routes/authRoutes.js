const express = require('express');
const authControllers = require('../controllers/authControllers')
const router = express.Router();

// Get Signup Page
router.get('/signup', authControllers.signupPage);

// Signup User
router.post('/signup', authControllers.signup);

// Get Login Page
router.get('/login', authControllers.loginPage);

// Login User
router.post('/login', authControllers.login);

// Logout User
router.get('/logout', authControllers.logout);

module.exports = router;