const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// POST - Create profile
router.post('/',
  verifyToken,
  uploadMiddleware,
  profileController.createProfile
);

// PUT - Update profile
router.put('/',
  verifyToken,
  uploadMiddleware,
  profileController.updateProfile
);

// GET - Get profile
router.get('/',
  verifyToken,
  profileController.getProfile
);

module.exports = router;