const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.find({ email: email }).exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Authentication failed'
                })
            }

            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }

                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, { expiresIn: '1h' });

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
                message: error
            });
        });
}

exports.register = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const userName = req.body.username;
    const gender = req.body.gender;
    const phone = req.body.phone;

    User.find({ email: email }).exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'User exists already'
                });
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            message: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: email,
                            password: hash,
                            username: userName,
                            gender: gender,
                            phone: phone
                        });

                        user.save().then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User created successfully',
                                user: {
                                    id: result._id,
                                    email: result.email,
                                    username: result.username,
                                    gender: result.gender,
                                    phone: result.phone,
                                    about: result.about
                                }
                            });
                        }).catch(error => {
                            res.status(500).json({
                                message: error
                            });
                        })
                    }
                });
            }
        });
}


exports.getAllUsers = (req, res, next) => {
    User.find().exec()
        .then(docs => {
            const response = {
                all_users_count: docs.length,
                users: docs.map(doc => {
                    return {
                        id: doc._id,
                        username: doc.username,
                        email: doc.email,
                        gender: doc.gender,
                        phone: doc.phone,
                        about: doc.about
                    }
                }),
            };

            res.status(200).json(response);

        }).catch(error => {
            res.status(500).json({
                message: error
            })
        });
}

exports.deleteUser = (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id }).exec()
        .then(user => {
            res.status(200).json({
                message: 'User deleted'
            });
        }).catch(error => {
            res.status(500).json({
                message: error
            });
        });
}

exports.updateProfile = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    User.update({ _id: id }, { $set: updateOps }).exec().then(result => {
        User.findById(id).select('email username about gender phone _id').exec().then(user => {
            res.status(200).json({
                message: 'Profile updated',
                user: user
            });
        }).catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'An error occured'
            });
        });

    }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: error
        });
    });
}

exports.getProfile = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id).select('_id username email gender phone about')
        .exec().then(user => {
            if (user) {
                res.status(200).json({
                    user: user
                });
            } else {
                res.status(404).json({
                    message: 'User does not exist'
                });
            }

        }).catch(error => {
            res.status(500).json({
                message: error
            })
        });
}

