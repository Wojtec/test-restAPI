require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {login} = require('./auth');
const {loginApi} = require('./actions');

//Routes
const policiesRoutes = require('./routes/policies');
const clientRoutes = require('./routes/clients');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api/v1/login',login,loginApi);

//Policies routes
app.use('/api/v1/policies', policiesRoutes)

//Clients routes
app.use('/api/v1/clients', clientRoutes)

//Error handler 
app.use((err, req, res, next) => {
    res.status(500).send({ error: err.message })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Listening http://localhost:' + PORT))