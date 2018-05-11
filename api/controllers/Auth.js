const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const utils = require('../../Utils/AuthUtils');


exports.login = (req, res, next) => {
    res.send('Login');
};

exports.register = (req,res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      var user = new User();
      user._id = new mongoose.Types.ObjectId();
      user.password = hash;
      user.email = req.body.email;
      user.isVerified = false;
  
      user.save(function(err){
        if(err) throw err;
  
        utils.sentMailVerificationLink(user,jwt.sign(user,process.env.JWT_KEY),function(error,success){
          if(err) {
            res.json({success: false, message: 'Email Verification Failed'});
          } else {
            res.json({success: true, message: 'Email Verification Succeeded'});
          }
        })
      });
    });
  }
  






