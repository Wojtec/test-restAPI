const express = require('express');
const router = express.Router();

/**
 *  
 * USER ROUTES
 * 
 **/

const {login} = require('../controllers/user');
const {loginApi} = require('../actions');

//User routes
router.post('',login,loginApi);

module.exports = router;

