const fetch = require("node-fetch");

const CLIENT_URL = "https://dare-nodejs-assessment.herokuapp.com/api/";


const data = JSON.stringify({
        client_id: "axa",
        client_secret: "s3cr3t"
})

let TOKEN_API = {}

const loginApi = async() =>{
    try{
        const response = await fetch(CLIENT_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        const content = await response.json();
    
        TOKEN_API = content.token;
        console.log(TOKEN_API);
    }catch(err){
        console.log(err);
    }
    
}
const getPolicies = async () => {
    const token  = TOKEN_API;
    console.log(token);
    try{
        const response = await fetch(CLIENT_URL + 'policies', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": 'Bearer ' + token
            },
        })
        const content = await response.json();
        return content;
    }catch(err) {
        console.log(err);
    }
}

module.exports = {
    loginApi,
    getPolicies
}