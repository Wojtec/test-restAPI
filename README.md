# Mandatory points
* Authentication and authorization. The authentication model must be based on https://tools.ietf.org/html/rfc6750.

* Include tests (at least 1 unit test, 1 integration test and one end to end tests).

* Using JavaScript ES6.

* Deliver the codebase on github or any source control tool. It would be great if we can see incremental steps at the commits history.

* Use Latest Node.js LTS version.

* DON'T USE A DB. The API REST youyr must to deliver is a middleware, so is very important to propagate the request to the data source INSURANCE API REST and to manage the error handling and the asynchronism.

* Configuration of a linter and some specific rules to maintain code coherence style. For example https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base.



## Installation

To get started with test-restApi you need to clone project from git repository.

In your terminal:

```
git clone https://github.com/Wojtec/test-restAPI.git
```

## Run application

Open project in your code editor and install all dependencies

Make sure that you are in correct path `/test-restAPI#`  in your terminal and write :

```
npm install
```

```
npm start
```

Server should be listening on `http://localhost:3000`

To use application you will need some API testing tool for example `Postman` Available on [Postman](https://docs.api.getpostman.com/)

## Endpoints

#CLIENT_CREDENTIALS 

    For get role "user"

    username: "test"
    password: "test"

    For get role "admin"

    username: "test2"
    password: "test2"


#Login 

Retrieve the auth token.

```
POST /api/v1/login
```

This endpoint will allow for the user login to the application and recive token if veryfication will be valid.

````csharp
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE2MDAwMTM1NjQsImV4cCI6MzIwMDAzMDcyOH0.6HMZgHQY-7nP5bJsevOK3ZJts2-s3Gahd0Ca27bVG5g",
    "type": "Bearer",
    "expiresIn": 1600017164
}
````

In folder `/src/controllers/user.js` you can find middleware to this endpoint.

````csharp
const login = (req, res, next) => {
    try{ 

        // get data from request body
        const data = req.body;

        // verify user 
        const user = verifyUser(data);

        // if user is not verified response 401 with message 
        if(!user) res.status(401).send({message: "Username or password is not valid."});
        
        // if user is verified send user grant to generate token
        const accessToken = generateAccessToken(user);

        // response status 200 and sent object with access token
        res.status(200).send(accessToken);

        // next to call another function from this endpoint
        next();
        
    }catch(err){
        // if is an error in block try catch error and send to error handler in /src/app.js
        next(err)
    }
}
````

In folder `/src/services/auth.js` you can find controller and middleware to `Authorization/Authentication`.


````csharp
//Generate access token
const generateAccessToken = (user) => {

    //Create expiring time for token
    const exp = Math.floor(Date.now() / 1000) + (60 * 60);

    //Create token
    const token = jwt.sign(user, config.secret,{
        algorithm: 'HS256',
        expiresIn: exp 
    });

    //Return a valid Bearer access token for the valid client_credentials provided.
    return { token, type:"Bearer", expiresIn: exp };
}
````

````csharp
//Verify token access
const verifyToken = (req, res, next) => {
    try{

        //Get token from headers
        const bearerHeader = req.headers['authorization'];

        //Separate token from Bearer
        const token = bearerHeader && bearerHeader.split(' ')[1];

        //Check if token is true
        if(!token) return res.status(401).send({message: 'Unauthorized'});

        //Verify token
        jwt.verify(token, config.secret, (err, user) => {

            //Check if token is valid
            if(err) return res.status(401).send({message: 'Token is not valid'});

            //Set user payload from token
            req.user = user;

            //Call next function from endpoint
            next();

        })

    }catch(err){

        //If is error send to error handler in /src/app.js
        next(err);
    }
}
````

#Policies 

Get the list of policies' client paginated and limited to 10 elements by default.

```
Get /api/v1/policies
```

This endpoint will allow for the user recive policies data.

````csharp
 {
        "id": "64cceef9-3a01-49ae-a23b-3761b604800b",
        "amountInsured": "1825.89",
        "email": "inesblankenship@quotezart.com",
        "inceptionDate": "2016-06-01T03:33:32Z",
        "installmentPayment": true
 }
````

In folder `/src/controllers/policies.js` you can find middleware to this endpoint.

````csharp
// Get policies with query limit example: /api/v1/policies?limit=10
const getPoliciesData = async (req, res, next) => {
    try{
        //Array for policies
        let policies = [];
        //Destructurise limit from query string
        const { limit } = req.query;
        //Consume Api policies route
        const data = await getPolicies();
        //Limit data by query string or by default 10
        const limitData = data.slice(0, limit || 10);

        //Change data content and push to array with policies
        limitData.map(p => {
            const { clientId, ...withoutClientId } = p;

            return policies.push(withoutClientId)
        })
        //Return response with policies data json
        return res.status(200).json(policies);

    }catch(err){
        //If is error send to handler error what is in /src/app.js
        next(err);
    }
}
````

#Policies by ID

Get the details of a policy's client.

```
Get /api/v1/policies/:id
```

This endpoint will allow for the user recive client policy details.

````csharp
{
    "id": "64cceef9-3a01-49ae-a23b-3761b604800b",
    "amountInsured": "1825.89",
    "email": "inesblankenship@quotezart.com",
    "inceptionDate": "2016-06-01T03:33:32Z",
    "installmentPayment": true,
    "clientId": "e8fd159b-57c4-4d36-9bd7-a59ca13057bb"
}
````

In folder `/src/controllers/policies.js` you can find middleware to this endpoint.

````csharp
// Get policies by Id example:/api/v1/policies/e8fd159b-57c4-4d36-9bd7-a59ca13057bb
const getPoliciesById = async (req, res, next) => {
    try{
        //Get policy id from req.param
        const { id } = req.params;

        //Consume Api and get policies data
        const data = await getPolicies();

        //Find policy by id
        const findById = data.find(p => p.id === id);
       
        //If policy not exist return 404 not found error
        if(!findById) return res.status(404).send({message: 'Not Found error'})
       
        //Return policy details 
        return res.status(200).json(findById);
    
    }catch(err){
        //If is error send to handler error what is in /src/app.js
        next(err);
    }
}

````

#Clients

