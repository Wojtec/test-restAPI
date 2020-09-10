const config = require('./config');
const jwt = require('jsonwebtoken');
const { verifyUser } = require('./controllers/user');


const generateAccessToken = (user) => {
    const exp = Math.floor(Date.now() / 1000) + (60 * 60);
    const token = jwt.sign(user, config.secret,{
        algorithm: 'HS256',
        expiresIn: exp 
    });
    return {token, type:"Bearer", expiresIn: exp };
}

const verifyToken = (req, res, next) => {
    try{
        const bearerHeader = req.headers['authorization'];
        const token = bearerHeader && bearerHeader.split(' ')[1];

        if(!token) return res.status(401).send({message: 'Unauthorized'});
       
        if(token){
            jwt.verify(token, config.secret, (err, user) => {
                if(err) return res.status(401).send({message: 'Token is not valid'});
                req.user = user;
                next();
            })
        }
        
    }catch(err){
        next(err);
    }
}

const login = (req, res, next) => {
    try{
        const data = req.body;
        const user = verifyUser(data);
    
        if(!user) res.status(400).send({message: "Username or password is not valid."});
        
        if(user){
            const accessToken = generateAccessToken(user);
            res.status(200).send(accessToken);
            next();
        }

    }catch(err){
        next(err);
    }
}



module.exports = {
    verifyToken,
    login,
    generateAccessToken
}