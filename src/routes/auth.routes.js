const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

// hidden routes (no authentication required)
router.post('/register', authController.registerAdmin);

// User routes
router.post('/login', authController.loginUser);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetUserPassword);


// export router
module.exports = router;