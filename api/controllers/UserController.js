const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.find({email: email}).exec()
        .then(user => {
            if(user.length < 1) {
                res.status(401).json({
                    message: 'Authentication failed'
                })
            } 

            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }

                if(result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {expiresIn: '1h'});

                    return res.status(200).json({
                        message: 'Login successful',
                        token: token
                    });
                }

                return res.status(401).json({
                    message: 'Authentication failed'
                });
            });
        }).catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
}

exports.register = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const userName = req.body.username;

    User.find({email: email}).exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(409).json({
                    message: 'User exists already'
                });
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: email,
                            password: hash,
                            username: userName
                        });

                        user.save().then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User created successfully',
                                user: {
                                    id: result._id,
                                    email: result.email,
                                    username: result.username
                                }
                            });
                        }).catch(error => {
                            res.status(500).json({
                                error: error
                            });
                        })
                    }
                });
            }
        });
}


exports.getAllUsers = (req, res, next) => {
    User.find().select('username email _id').exec()
        .then(docs => {
            const response = {
                all_users_count: docs.length,
                users: docs.map(doc => {
                    return {
                        id: doc._id,
                        username: doc.username,
                        email: doc.email
                    }
                }),
            };

            res.status(200).json(response);
            
        }).catch(error => {
            res.status(500).json({
                error: error
            })
        });
}

exports.deleteUser = (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id}).exec()
        .then(user => {
            res.status(200).json({
                message: 'User deleted'
            });
        }).catch(error => {
            res.status(500).json({
                error: error
            });
        });
}

