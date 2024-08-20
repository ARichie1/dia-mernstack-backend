const express = require('express');
const userControllers = require('../controllers/userControllers');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// GET ALL USERS
router.get('/users', requireAuth, userControllers.getUsers)

// GET SIGN IN USER
router.get('/user/:id', userControllers.getUser)

// VIEW ANOTHER REGISTERED USER
router.get('/user/:myid/view/:theirid', userControllers.viewAnotherUser)

// UPDATE USER CREDENTIAL
router.patch('/user/:id', userControllers.updateUser)

// DELETE USER ACCOUNT
router.delete('/user/:id', userControllers.deleteUser);

module.exports = router;