const express = require('express');
const router = express.Router();

//Import controller :
const userCtrl = require('../controllers/user');
//Middleware - validation d'adresse mail/mot de passe :
const passwordValid = require('../middleware/password-validator');
const emailValid = require('../middleware/email-validator')

//Routes :
router.post('/signup', emailValid, passwordValid, userCtrl.signup);
router.post('/login', userCtrl.login);
router.use('/', userCtrl.getAllUsers);

//Export du router :
module.exports = router;