//Import :
const bcrypt = require('bcrypt'); //Cryptage du mot de passe
const jwt = require('jsonwebtoken'); //Génération du token
const User = require('../models/user'); //User Model
const maskemail = require('maskemail'); //Cryptage de l'adresse mail

//Inscription de l'utilisateur :
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                email: maskemail(req.body.email, { allowed: /@\.-/ }), //Cryptage de l'adresse mail
                password: hash //Cryptage du mot de passe
            });
        user.save().then(
            () => {
                res.status(201).json({
                    message: 'Utilisateur ajouté.'
                });
            }
        ).catch(
            (error) => {
                res.status(500).json({
                    error: error
                });
            }
        );
        }
    );
};

//Connexion de l'utilisateur :
exports.login = (req, res, next) => {
    User.findOne({ email: maskemail(req.body.email) }).then(
        (user) => {
            if (!user) { //Si un utilisateur avec cette adresse mail n'esite pas
                return res.status(401).json({
                    error: new Error('Utilisateur non trouvé.')
                });
            }
            bcrypt.compare(req.body.password, user.password).then( //Validation du mot de passe
                (valid) => {
                    if (!valid) { //Si le mot de passe n'est pas correct
                        return res.status(401).json({ 
                            error: new Error('Le mot de passe est incorrect.')
                        });
                    }
                    const token = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' });
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
}

//Récupérer toutes les informations sur les utilisateurs :
exports.getAllUsers = (req, res, next) => {
    User.find().then(
        (users) => {
            res.status(200).json(users);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
