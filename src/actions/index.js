const fetch = require("node-fetch");

const CLIENT_URL = "https://dare-nodejs-assessment.herokuapp.com/api/login";


const data = JSON.stringify({
        client_id: "axa",
        client_secret: "s3cr3t"
})

const TOKEN_API = []
const loginApi = async() =>{
    try{
        const response = await fetch(CLIENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        const content = await response.json();
    
        TOKEN_API.push(content.token);
        console.log(TOKEN_API);
    }catch(err){
        console.log(err);
    }
    
}


module.exports = {
    loginApi
}