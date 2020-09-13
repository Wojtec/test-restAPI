const fetch = require("node-fetch");
const fs = require('fs').promises;
const { readToken, refreshToken } = require('../helpers')

/**
 * 
 * ACTIONS FOR API INTEGRATION
 * 
 **/


//Client URL
const CLIENT_URL = process.env.CLIENT_URL || "https://dare-nodejs-assessment.herokuapp.com/api/";

//Client credentials
const CLIENT_CREDENTIALS = JSON.stringify({
        client_id: process.env.CLIENT_ID || "axa",
        client_secret: process.env.CLIENT_SECRET || "s3cr3t"
})


//Get API token and write in file authData.json
const loginApi = async () =>{
    try{
        const response = await fetch(CLIENT_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: CLIENT_CREDENTIALS
        })
        const content = await response.json();
        
        await fs.writeFile('./apiData.json', JSON.stringify(content), 'utf8');

       return content.token;

    }catch(err){
        console.error(err);
    }
}

//Get policies data
const getPolicies = async () => {
    try{
        const getToken = await readToken();
        const freshToken = await refreshToken(getToken);
        const response = await fetch(CLIENT_URL + 'policies', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": 'Bearer ' + freshToken
            },
        })

        const content = await response.json();
        return content;
        
    }catch(err) {
        console.error(err);

    }
}

//Get clients data
const getClients = async () => {
    try{
        const getToken = await readToken();
        const freshToken = await refreshToken(getToken);
        
        const response = await fetch(CLIENT_URL + 'clients', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": 'Bearer ' + freshToken
            },
        })

        const content = await response.json();
        return content;
        
    }catch(err) {
        console.error(err);

    }
}

module.exports = {
    loginApi,
    getPolicies,
    getClients,
}