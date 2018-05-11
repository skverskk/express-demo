const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * signup controller
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email Address Already Exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            isVerified: false,
                            // temptoken: jwt.sign({ email: req.body.email }, process.env.JWT_KEY, { expiresIn: '12h' }),
                            password: hash
                        });
                         // Temp Token
                         const token = jwt.sign({
                            userId: user._id
                        }, process.env.JWT_KEY,
                        { 
                            expiresIn: "1h"
                        }
                    );
                    console.log('Token ---> ', token);

                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    success: true,
                                    message: 'User Successfully Created - Please check your email for activation link'
                                });
                            })
                            
                            .catch(err => {
                                res.status(500).json({
                                    success: false,
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

/**
 * Login Controller
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = ( req, res, next ) => {
    User.find({ email: req.body.email })
    .exec()
    .then( user => {
        if ( user.length < 1 ) {
            return res.status(401).json({
                message: "Authorization Failed"
            });
        }
        bcrypt.compare( req.body.password, user[0].password, (err, result ) => { 
            if ( err ) {
                return res.status(401).json({
                    message: "Authorization Failed"
                }); 
            }
            if ( result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY,
                { 
                    expiresIn: "1h"
                }
            );
                return res.status(200).json({
                    message: 'Authorization Succeeded',
                    token: token
                });    
            }
            res.status(401).json({
                message: "Authorization Failed"
            });
    });
})
    .catch( err => {
        res.status(500).json({
            error: err
        });     
    });
}

/**
 * Delete User
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.delete = ( req, res, next ) => {
    User.remove({ _id: req.params.id })
    .exec()
    .then( result => {
        res.status(200).json({
            message: "User Successfully Deleted"
        });
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    });
}


