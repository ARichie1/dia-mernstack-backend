const express = require('express');
const userControllers = require('../controllers/userControllers');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// require auth for all user route
router.use(requireAuth)

// GET ALL USERS
router.get('/users', userControllers.getUsers)

// GET SIGN IN USER
router.get('/user', userControllers.getUser)

// GET SIGN IN USER OPPONENT
router.get('/user/opponent/:theirid', userControllers.getOpponent)

// VIEW ANOTHER REGISTERED USER
router.get('/user/:myid/view/:theirid', userControllers.viewAnotherUser)

// UPDATE USER CREDENTIAL
router.patch('/user/:id', userControllers.updateUser)

// DELETE USER ACCOUNT
router.delete('/user/:id', userControllers.deleteUser);

module.exports = router;