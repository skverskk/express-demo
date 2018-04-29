require('dotenv').config();
const Joi = require('joi');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('winston');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// const course = require('./api/routes/course');

mongoose.connect("mongodb://" + process.env.DB_USER + ":" + process.env.DB_PWD + "@ds011308.mlab.com:11308/products")
.then(() => console.log('MongoDB Connected...'))
.catch( err => console.log(err));
mongoose.Promise = global.Promise;
  

const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');
const userRoute = require('./api/routes/user');



const app = express();
const winston = require('winston'),
    expressWinston = require('express-winston');

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS
app.use(( req, res, next) => {
  res.header( 'Access-Control-Allow-Origin', '*');
  res.header( "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
);
if( req.method === 'OPTIONS') {
  res.header( 'Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
  return res.status(200).json({});
}
next();
 });


// app.use('/api', course);
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);
app.use('/user', userRoute);


// Error Handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

app.use(( error, req, res, next) => {
  res.status( error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});



app.use(compression());


// app.use(bodyParser.urlencoded({ extended: false }));


// var cookieParser = require('-parser')
// var csrf = require('csurf')
// var bodyParser = require('body-parser')
// var express = require('express')


app.use(helmet( {
    frameguard: {
        action: 'deny'
    }
}));

// express-winston logger makes sense BEFORE the router.
app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      }),
      new winston.transports.File({
        name: 'Error',
        level: 'error',
        filename: './logs/winstonLog-error.log',
        maxsize: 10000000,
        maxFiles: 5,
        json: true,
        colorize: false
      }),
      new winston.transports.File({
        name: 'Info',
        level: 'info',
        filename: '/dev/logs/winstonLog-info.log',
        maxsize: 10000000,
        maxFiles: 5,
        json: true,
        colorize: false
      }),
      new winston.transports.File({
        name: 'Debug',
        level: 'debug',
        filename: '/dev/logs/winstonLog-debug.log',
        maxsize: 10000000,
        maxFiles: 5,
        json: true,
        colorize: false
      })
    ]
  })
);

 app.use(express.json());


// now add csrf and other middlewares, after the "/api" was mounted
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser())
// app.use(csrf({ cookie: true }))





//Enviro Var Port
const port = process.env.Port || 3000;
// Start Server
app.listen(port, () => console.log(`Server started on Port ${port}...`));