const express = require('express');
const authControllers = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authControllers.registeruser);
router.post('/login', authControllers.loginuser)
router.post('/logout', authControllers.logout);
router.get('/user', authMiddleware.authUser, authControllers.getUser);

module.exports = router;

