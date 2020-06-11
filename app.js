const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const authRoute = require('./api/routes/auth');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use('/user', authRoute);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next();
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;
