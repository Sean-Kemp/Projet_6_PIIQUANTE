const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //Vérifie que l'adresse mail n'existe pas déjà dans la base de données

//Model User :
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

//Export du model :
module.exports = mongoose.model('Users', userSchema);