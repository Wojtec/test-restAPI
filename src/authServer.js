const express = require('express');
const app = express();
const config = require('./config');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { verifyUser } = require('./controllers/user');
const { loginApi } = require('./actions');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const generateAccessToken = async (user) => {
    const exp = Math.floor(Date.now() / 1000) + (60 * 60);
    const token = jwt.sign(user, config.secret,{
        algorithm: 'HS256',
        expiresIn: exp 
    });

    return {token, type:"Bearer", expiresIn: exp };
}

const verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader && bearerHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, config.secret, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
  
    })
    
    await loginApi();
    next();
}

const login = async (req, res, next) => {
    const data = req.body;
    const user = await verifyUser(data);

    if(!user) res.status(400).send({message: "Username or password is not valid."});
    
    if(user){
        const { onlyUser } = user;
        const accessToken = await generateAccessToken(onlyUser);
        const {token, type} = accessToken;
        res.header("Authorization",token).send(accessToken);
    }
    next();    
}

app.use('/api/v1/login',login,loginApi);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Listening http://localhost:' + PORT))

module.exports = {
    verifyToken,
    login,
    generateAccessToken
}