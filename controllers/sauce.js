//Import :
const Sauce = require('../models/sauce'); //Model Sauce
const fs = require('fs'); //Gestion des fichiers (pour les images)

//Récupérer toutes les informations sur les sauces :
exports.getSauces = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

//Récupérer l'informations sur une sauce spécifique (en utilisant son ID) :
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
};

//Création/ajout d'une nouvelle sauce :
exports.createSauce = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        userId: req.userIdToken,
        imageUrl: url + '/images/' + req.file.filename,
    });
    sauce.save().then(
      () => {
        res.status(201).json({
          message: 'Votre sauce a été enregistrée.'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

//Modification d'une sauce existante :
exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) { //Si la modification nécessite le téléchargement d'une image :
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = ({
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            heat: req.body.sauce.heat,
            imageUrl: url + '/images/' + req.file.filename,
        });
    } else {
        sauce = ({ //Si la modification ne nécessite pas le téléchargement d'une image :
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            heat: req.body.heat,
            imageUrl: req.imageUrl
        });
    }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
      () => {
        res.status(201).json({
          message: 'Votre sauce a été mise à jour.'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

//Suppression d'une sauce :
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            if (!sauce) { //Vérifie que la sauce existe
                return res.status(404).json({
                    error: new Error('L\'objet n\'a pas été trouvé.')
                });
            }
            if (sauce.userId !== req.auth.userId) { //Vérifie que l'utilisateur est autorisé à supprimer cette sauce
                return res.status(401).json({
                    error: new Error('Non autorisé')
                });
            }
            const filename = sauce.imageUrl.split('/images/')[1]; //Suppression de l'image
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({_id: req.params.id}).then( //Suppression de la sauce
                    () => {
                      res.status(200).json({
                        message: 'Supprimé!'
                      });
                    }
                ).catch(
                    (error) => {
                      res.status(400).json({
                        error: error
                      });
                    }
                );
            })
        }
    )

};

//Gestion des likes/dislikes/unlikes :
exports.likeSauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }).then(
        (sauce) => {
            if (req.body.like == 1) { //pour ajouter un like
                Sauce.updateOne(
                    { _id: req.params.id },
                    { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }}
                ).then(
                    () => {
                        res.status(200).json({
                            message: 'Liked!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                )
            } else if (req.body.like == -1) { //pour ajouter un dislike
                Sauce.updateOne(
                    { _id: req.params.id },
                    { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }}
                ).then(
                    () => {
                        res.status(200).json({
                            message: 'Disliked!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                )
            } else if (req.body.like == 0) { //pour supprimer un like
                Sauce.findOne(
                    { _id: req.params.id }
                ).then(
                    (sauce) => {
                        if (sauce.usersLiked.includes(req.body.userId)) {
                            Sauce.updateOne(
                                { _id: req.params.id },
                                { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }}
                            ).then(
                                () => {
                                    res.status(200).json({
                                        message: 'Unliked!'
                                    });
                                }
                            ).catch(
                                (error) => {
                                    res.status(400).json({
                                        error: error
                                    });
                                }
                            )
                        } else if (sauce.usersDisliked.includes(req.body.userId)) { //pour supprimer un dislike
                            Sauce.updateOne(
                                { _id: req.params.id },
                                { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }}
                            ).then(
                                () => {
                                    res.status(200).json({
                                        message: 'Un-disliked!'
                                    });
                                }
                            ).catch(
                                (error) => {
                                    res.status(400).json({
                                        error: error
                                    });
                                }
                            )
                        }
                    }
                )
            }
        }
    )

}

