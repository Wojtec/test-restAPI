const express = require('express');
const router = express.Router();

const { getPoliciesData, getPoliciesById } = require('../controllers/policies');
const { verifyToken } = require('../services/auth');

//Policies routes
router.get('/:id',verifyToken,getPoliciesById);
router.get('',verifyToken,getPoliciesData);


module.exports = router;