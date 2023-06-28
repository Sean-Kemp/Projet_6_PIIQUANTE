const express = require('express');
const router = express.Router();

//Middleware :
const auth = require('../middleware/auth'); //Vérifie authorité de l'utilisateur
const multer = require('../middleware/multer-config'); //Définie déstination/nom des images chargées

//Fichier Routes :
const sauceCtrl = require('../controllers/sauce');

//Routes :
router.get('/', auth, sauceCtrl.getSauces); 
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

//Export du router :
module.exports = router;