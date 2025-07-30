const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Public routes
router.post('/save-user', authController.saveUserData);

// Protected routes
router.use(authController.verifyToken);
router.get('/me', authController.getCurrentUser);
router.get('/:id', userController.getUserById);
router.put('/update', userController.updateUser);

module.exports = router;    