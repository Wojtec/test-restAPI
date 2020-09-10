const fetch = require("node-fetch");
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');

//Client URL
const CLIENT_URL = process.env.CLIENT_URL;

//Client credentials
const data = JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
})

//Read token from file authData.json
const readToken = async () => {
  const readFile = await fs.readFile('./authData.json');
  const data = JSON.parse(readFile);
  return data.token;
}

//Check if API token is expired
const refreshToken = async (token) => {
    const decodeToken =  jwt.decode(token, {complete: true})
    const { payload } = decodeToken;

    if (Date.now() >= payload.exp * 1000) {
            await loginApi();
            return await readToken();
    } else {
        return token;
    }
}

//Get API token and write in file authData.json
const loginApi = async () =>{
    try{
        const response = await fetch(CLIENT_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        const content = await response.json();

        return await fs.writeFile('./authData.json', JSON.stringify(content), 'utf8');

    }catch(err){
        console.log(err);
    }
}

//Get policies data
const getPolicies = async () => {
    try{
        const getToken = await readToken();
        const freshToken = await refreshToken(getToken);
        
        if(freshToken){
            const response = await fetch(CLIENT_URL + 'policies', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": 'Bearer ' + freshToken
                },
            })

            const content = await response.json();
            return content;
        }
    }catch(err) {
        console.log(err);
    }
}

//Get clients data
const getClients = async () => {
    try{
        const getToken = await readToken();
        const freshToken = await refreshToken(getToken);
        
        if(freshToken) {
            const response = await fetch(CLIENT_URL + 'clients', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": 'Bearer ' + freshToken
                },
            })

            const content = await response.json();
            return content;
        }
    }catch(err) {
        console.log(err);
    }
}

module.exports = {
    loginApi,
    getPolicies,
    getClients
}