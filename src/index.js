const express = require('express');
const app = express();

const authController = require('./controllers/auth.js');
const policiesController = require('./controllers/policies');

app.get('/', (req, res) => {
    res.send('test');
})

app.use('/login', authController.login);
app.use('/policies',authController.login,policiesController.get)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Listening http://localhost:' + PORT))