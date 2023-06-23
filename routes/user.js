const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwordValid = require('../middleware/password-validator');
const emailValid = require('../middleware/email-validator')

router.post('/signup', emailValid, passwordValid, userCtrl.signup);
router.post('/login', userCtrl.login);
router.use('/', userCtrl.getAllUsers);


module.exports = router;