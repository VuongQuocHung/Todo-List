const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', authValidation.registerPost, authController.registerPost);

router.post('/login', authValidation.loginPost, authController.loginPost);

router.get('/me',authMiddleware.requireAuth, authController.me);

router.post('/logout', authController.logoutPost);


module.exports = router;
