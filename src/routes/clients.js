const express = require('express');
const router = express.Router();

const { getClientsData, getClientsById, getPoliciesByClientId } = require('../controllers/clients');
const { verifyToken } = require('../services/auth');

//Clients routes
router.get('/:id/policies',verifyToken,getPoliciesByClientId)
router.get('/:id',verifyToken,getClientsById)
router.get('',verifyToken,getClientsData)

module.exports = router;