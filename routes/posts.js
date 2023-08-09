const express = require('express');
const verifyToken = require('../controllers/auth')

const router = express.Router();

//Read
router.get('/', verifyToken)