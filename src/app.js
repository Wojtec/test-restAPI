require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


//Routes
const userRoutes = require('./routes/user');
const policiesRoutes = require('./routes/policies');
const clientRoutes = require('./routes/clients');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//user
app.use('/api/v1/login', userRoutes);

//Policies routes
app.use('/api/v1/policies', policiesRoutes)

//Clients routes
app.use('/api/v1/clients', clientRoutes)

//Error handler 
app.use((err, req, res, next) => {
    res.status(500).send({ error: err.message })
})

module.exports = app;