const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://almantas88:almantas88@node-rest-shop-kt3ov.mongodb.net/test?retryWrites=true&w=majority';

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(uri, {  useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
    );
    const connection = mongoose.connection;
    connection.once('open', () => {
      console.log("MongoDB database connection established successfully");
    });

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status= 404;
    //console.log("1 - here");
    //console.log("1 - here", error);
    next(error);
    //console.log("2 - here");
});

app.use((error, req, res, next) => {
    //console.log("3 - here", error);
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });

});

module.exports = app;