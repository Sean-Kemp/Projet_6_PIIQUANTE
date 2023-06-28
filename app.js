

//Import packages:
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const helmet = require('helmet'); //Ajoute des headers de sécurité
const mongoose = require('mongoose');
const rateLimit = require('./middleware/rateLimit');  //Limiter le nombre de requêtes.
const mongoSanitize = require('express-mongo-sanitize');  //Assainir les entrées contre les attaques par injection.
const xssClean = require('xss-clean');  //Vérifier l'entrée de l'utilisateur provenant du corps POST, des requêtes GET et des paramètres de l'url.
const morgan = require('morgan'); //Log requêtes

//Import Routes :
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Execution des packages : 
app.use(cors());
app.use(rateLimit);
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
app.use(express.json());
app.use(mongoSanitize());
app.use(xssClean());
app.use(morgan('tiny'));

// Connexion à MongoDB Atlas :
mongoose.connect('mongodb://seankemp:8HzhBI5Wa6aPTVFn@ac-q7ukly8-shard-00-00.f9zjypn.mongodb.net:27017,ac-q7ukly8-shard-00-01.f9zjypn.mongodb.net:27017,ac-q7ukly8-shard-00-02.f9zjypn.mongodb.net:27017/?ssl=true&replicaSet=atlas-cgvqyn-shard-0&authSource=admin&retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB Atlas réussie !');
  })
  .catch((error) => {
    console.log('Impossible de se connecter à MongoDB Atlas !');
    console.error(error);
  });

// CORS Policy - permet le partage entre serveurs :
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Execution des routes :
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

 // Export de l'application :
module.exports = app;