const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const authRoute = require('./api/routes/auth');
// const profileRoute = require('./api/routes/profile');

mongoose.connect(
    'mongodb+srv://adetoba:' + process.env.MONGO_ATLAS_PASSWORD 
        + '@me-you-vicye.mongodb.net/<dbname>?retryWrites=true&w=majority'
    , {
        useUnifiedTopology: true, 
        useNewUrlParser: true
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use('/api/auth', authRoute);
// app.use('/api/profile', profileRoute);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;
