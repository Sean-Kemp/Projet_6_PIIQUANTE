
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('./middleware/rateLimit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const morgan = require('morgan');


const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


app.use(cors());
app.use(rateLimit);
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
app.use(express.json());
app.use(mongoSanitize());
app.use(xssClean());
app.use(morgan('tiny'));



mongoose.connect('mongodb://seankemp:8HzhBI5Wa6aPTVFn@ac-q7ukly8-shard-00-00.f9zjypn.mongodb.net:27017,ac-q7ukly8-shard-00-01.f9zjypn.mongodb.net:27017,ac-q7ukly8-shard-00-02.f9zjypn.mongodb.net:27017/?ssl=true&replicaSet=atlas-cgvqyn-shard-0&authSource=admin&retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;