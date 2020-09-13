const  actions  = require('../actions');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;


//Read token from file authData.json
const readToken = async () => {
    try{
    const readFile = await fs.readFile('./apiData.json');
    const data = JSON.parse(readFile);
    const { token } = data;
    return token;

    }catch(err){
        console.error(err);
    }        
}

//Check if API token is expired
const refreshToken = async (token) => {
    try{
        const decodeToken =  jwt.decode(token, {complete: true})
        const { payload } = decodeToken;

        if (Date.now() >= payload.exp * 1000) {

        const newToken = await actions.loginApi();
        
        return newToken;

        } else {

            return token;
        }
    }catch(err){
            console.error(err);
     }        
   
}

module.exports = {
    readToken,
    refreshToken
}