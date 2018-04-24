/**
 * courses.js - Routes for courses
 */
const Joi = require('joi');
const logger = require('winston');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const winston = require('winston'),
    expressWinston = require('express-winston');

const courses = [
    {id:1, name:'Course 1'},
    {id:2, name:'Course 2'},
    {id:3, name:'Course 3'}
]

// express-winston logger makes sense BEFORE the router.
router.use(expressWinston.logger({
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

 // Routes
router.get('/', (req,res) => {
 //   log.info('Root Home Page');
    res.send('Hello World');
});

// User Login
router.post('/login', (req,res) => {
    const user = {
        id: 1,
        username: 'skverskk',
        email:    'ken.skversky@gmail.com',
        admin:    false
    }
    jwt.sign({user:user}, 'secretkey',(err,token) => {
        res.json({
            token:token
        });
    });
});

// Get all courses
router.get('/courses',  (req,res) => {
    res.send(courses);
    res.end(); 
});

// Get course by Id
router.get('/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given Id does not exist');
    res.send(course);
});

// Protected Route
router.post('/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey',(err, authData) => {
        if(err) {
            res.sendStatus(401);
        } else {
            res.json({
                message: 'Post Created',
                authData
            })
        }
    });
});

//Post new course
router.post('/courses', (req, res) => {
    // Validation  
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(result.error.details[0].message);     
    
    const course = {
        id:   courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

// Update Course
router.put('/courses/:id', (req,res) => {
    // Check that id exists
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given Id does not exist');

    // Validation  
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);      
    course.name = req.body.name;
    res.send(course);
});

// Delete Course
router.delete('/courses/:id', (req, res) => {
    // Check that id exists
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given Id does not exist');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

router.get('/courses/:year/:month', (req,res) => {
    res.send(req.params);
});

//Catch invalid routes here
router.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
    res.end();
 });

 function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }
   return Joi.validate(course, schema);
}

// Verify Token
function verifyToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    // Check if Bearer is undefined
    if ( typeof bearerHeader !== 'undefined') {
        // Split between Bearer and Token Header
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        res.sendStatus(401);
    }
}

 module.exports = router;