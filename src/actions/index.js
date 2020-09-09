const fetch = require("node-fetch");

const CLIENT_URL = process.env.CLIENT_URL;

//Client credentials
const data = JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
})

let TOKEN_API = {}

//Get API token
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
        return TOKEN_API = content.token;

    }catch(err){
        console.error(err);
    }
    
}

//Get policies data
const getPolicies = async () => {
    try{
        const response = await fetch(CLIENT_URL + 'policies', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": 'Bearer ' + TOKEN_API
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
        const response = await fetch(CLIENT_URL + 'clients', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": 'Bearer ' + TOKEN_API
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
    getClients
}