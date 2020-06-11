const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/UserController');


router.post('/login', AuthController.login);

router.post('/register', AuthController.register);

router.get('/users', AuthController.getAllUsers);

router.delete('/delete/:userId', AuthController.deleteUser);

module.exports = router;