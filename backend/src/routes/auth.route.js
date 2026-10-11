const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');

router.post('/register', authValidation.registerPost, authController.registerPost);
router.post('/login', authController.loginPost);

module.exports = router;