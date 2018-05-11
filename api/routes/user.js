const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const checkAuth = require('../auth/check-auth');
const UserController = require('../controllers/User');

// router.post('/register', Auth.register);
// router.post('/authenticate', Auth.login);
// router.get( '/verify', Auth.verify);
router.post('/signup', UserController.signup);   
router.post('/login', UserController.login);
router.delete('/:id', checkAuth, UserController.delete );

module.exports = router;


