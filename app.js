//mongodb://seankemp:<password>@ac-q7ukly8-shard-00-00.f9zjypn.mongodb.net:27017,ac-q7ukly8-shard-00-01.f9zjypn.mongodb.net:27017,ac-q7ukly8-shard-00-02.f9zjypn.mongodb.net:27017/?ssl=true&replicaSet=atlas-cgvqyn-shard-0&authSource=admin&retryWrites=true&w=majority

//8HzhBI5Wa6aPTVFn

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

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


const app = express();
app.use(cors());


/*

 
app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
 
app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})
*/






app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



app.use(express.json());

/*
app.get('/api/sauces', (req, res, next) => {
    const sauces = [
        {
            _id: 'xxx',
            name: 'Test sauce',
            manufacturer: 'Info about test sauce.',
            description: 'Test description',
            heat: 1,
            likes: 1,
            dislikes: 1,
            imageUrl: 'https://joyfoodsunshine.com/wp-content/uploads/2018/09/best-homemade-pizza-sauce-recipe-1.jpg',
            mainPepper: 'Test pepper',
            usersLiked: ' ',
            usersDisliked: ' ',
            userId: '64806b3c1325b6239e23737f',
          }
    ];
    res.status(200).json(sauces);
});
*/

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;