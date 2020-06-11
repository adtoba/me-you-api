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
                        email = user[0].email,
                        userId = user[0]._id
                    }, process.env.JWT_KEY, {expiresIn: '1h'}

                    );

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

