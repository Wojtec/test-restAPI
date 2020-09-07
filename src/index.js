const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const policiesController = require('./controllers/policies');
const { verifyToken } = require('./authServer');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(verifyToken);

app.use('/api/v1/policies',policiesController.get)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Listening http://localhost:' + PORT))