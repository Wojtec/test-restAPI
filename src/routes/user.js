const express = require('express');
const router = express.Router();

const {login} = require('../auth');
const {loginApi} = require('../actions');

//User routes
router.post('',login,loginApi);

module.exports = router;

