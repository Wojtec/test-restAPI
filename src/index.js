const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { getClientsData, getClientsById } = require('./controllers/clients');
const { getPoliciesData, getPoliciesById } = require('./controllers/policies');
const { verifyToken } = require('./authServer');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Policies routes
app.use('/api/v1/policies/:id',verifyToken,getPoliciesById)
app.use('/api/v1/policies',verifyToken,getPoliciesData)

//Clients routes
app.use('/api/v1/clients/:id',verifyToken,getClientsById)
app.use('/api/v1/clients',verifyToken,getClientsData)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Listening http://localhost:' + PORT))