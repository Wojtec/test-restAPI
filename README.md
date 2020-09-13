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

Get the list of clients details paginated and limited to 10 elements by default also an optional filter query to filter by client name.

```
Get /api/v1/clients
```

* Query string

```
Get /api/v1/clients?limit=10&name=Britney
```

This endpoint will allow for the user recive clients details paginated separeted by roles.

* User role.

````csharp
{
        "id": "a3b8d425-2b60-4ad7-becc-bedf2ef860bd",
        "name": "Barnett",
        "email": "barnettblankenship@quotezart.com",
        "role": "user",
        "policie": []
}
````

* Admin role.

````csharp
 {
    "id": "a0ece5db-cd14-4f21-812f-966633e7be86",
    "name": "Britney",
    "email": "britneyblankenship@quotezart.com",
    "role": "admin",
    "policie": [
        {
            "id": "7b624ed3-00d5-4c1b-9ab8-c265067ef58b",
            "amountInsured": "399.89",
            "inceptionDate": "2015-07-06T06:55:49Z"
        }
    ]
}
````

In folder `/src/controllers/clients.js` you can find middleware to this endpoint.

````csharp
//Get clients by roles and filter by query limit and name example URL:/api/v1/clients?limit=5&name=Manning
const getClientsData = async (req, res, next) => {
    try{
        //After veryfication get role from request
        const { role } = req.user;

        //Get query data from query string
        const { limit, name } = req.query;

        //Consume Api and get clients data 
        const data = await getClients();

        //Consume Api and get policies data 
        const dataPolicies = await getPolicies();

        //Check is roles not exist throw 403 error 
        if(!role) return res.status(403).send({message: 'Forbidden error'})

        //Check condition if is true run code for user
        if(role === "user"){

            //Filter client data and return array with only users clients
            const dataByRole = data.filter(user => user.role === role);

            //For each user client check if exsit policies
            dataByRole.map(user => {

                //Array policies with objects inside
                const objPolice = [];

                //Filter policies data and return array policies if client id === user id 
                const policies = dataPolicies.filter(u => u.clientId === user.id);

                //Create new Array with data what is required
                policies.map(p => {
                     objPolice.push({
                        id: p.id,
                        amountInsured: p.amountInsured,
                        inceptionDate: p.inceptionDate
                    })
                })
                //Create value policie in user object and assign destructured Array
                user.policie = [...objPolice];
             })
           
            //Check if is query string
            if(limit || name ){
                //If is query string name filter users by name 
                const findByName = name ? dataByRole.filter(user => user.name === name) : dataByRole;

                //If is query string limit slice data to number of limits
                const limitData = findByName ? findByName.slice(0, limit) : dataByRole.slice(0, 10);
               
                //If query string is true response 200 with data
                return res.status(200).json(limitData);
            }
            //If endpoint is without query strings response with limit set by default 10 with status 200
            const limitedByDefault = dataByRole.slice(0, 10);
            return res.status(200).json(limitedByDefault);
        }
    
        //Check condition if is true run code for admin
        if(role === "admin"){

            //For each user in Array set new vale with policies
            data.map(user => {

                //New Array with objects policies
                const objPolice = [];

                //Check data policies and filter with user id
                const policies = dataPolicies.filter(u => u.clientId === user.id);

                //For each policie retrive required values 
                policies.map(p => {
                    
                    //Push values to new Array
                    objPolice.push({
                        id: p.id,
                        amountInsured: p.amountInsured,
                        inceptionDate: p.inceptionDate
                    })
                })
                
                //Create value policie in user object and assign destructured Array
                user.policie = [...objPolice];
             })

            //Check if is query string
            if(limit || name ){
                
                //If is query string name filter users by name 
                const findByName = name ? data.filter(user => user.name === name) : data;
                
                //If is query string limit slice data to number of limits
                const limitData = findByName ? findByName.slice(0, limit) : data.slice(0, 10);

                //If query string is true response 200 with data
                return res.status(200).json(limitData);
            }
          //If endpoint is without query strings response with status 200
          return  res.status(200).json(data);

        }
    }catch(err){
        //If is error send to handler error what is in /src/app.js
        next(err);
    }
}
````

#Clients by ID

Get the client's details

```
Get /api/v1/clients/:id
```

Can be accessed by client with role user and admin.

* User role.

````csharp
    {
        "id": "a3b8d425-2b60-4ad7-becc-bedf2ef860bd",
        "name": "Barnett",
        "email": "barnettblankenship@quotezart.com",
        "role": "user",
        "policies": []
    }
````

* Admin role.

````csharp
 {
    "id": "a0ece5db-cd14-4f21-812f-966633e7be86",
    "name": "Britney",
    "email": "britneyblankenship@quotezart.com",
    "role": "admin",
    "policie": [
        {
            "id": "7b624ed3-00d5-4c1b-9ab8-c265067ef58b",
            "amountInsured": "399.89",
            "inceptionDate": "2015-07-06T06:55:49Z"
        }
    ]
}
````

In folder `/src/controllers/clients.js` you can find middleware to this endpoint.

````csharp
//Get clients by roles and by ID with policies example URL: /api/v1/clients/a0ece5db-cd14-4f21-812f-966633e7be86
const getClientsById = async (req, res, next) => {
    try{
        //After veryfication get role from request
        const { role } = req.user;

        //Get client id from req.param
        const { id } = req.params;

        //Consume Api and get clients data 
        const dataClient = await getClients();

        //Consume Api and get policies data 
        const dataPolicies = await getPolicies();

        //Check is roles not exist throw 403 error
        if(!role) return res.status(403).send({message: 'Forbidden error'})

        //Check condition if is true run code for user
        if(role === "user"){

            //Filter client data and return array with only users clients
            const dataByRole = dataClient.filter(user => user.role === role);
            
            //If role not exist in data base return 404
            if(!dataByRole) return res.status(404).send({message: "Not Found error."});
            
            //Find client from data base by id 
            const findClientById =  dataByRole.find(c => c.id === id);

            //If client not exist in data base return 404
            if(!findClientById) return res.status(404).send({message: "Not Found error."});

                //Create new array for objects policies
                const policies = []
                
                //Filter data policies and return by client id
                const findPoliciesById =  dataPolicies.filter(c => c.clientId === id);

                //Return new object data with value requeried
                findPoliciesById.map(p => {

                    policies.push({
                        "id" : p.id,
                        "amountInsured" : p.amountInsured,
                        "inceptionDate": p.inceptionDate
                    })
                })

                //Create value policie in user object and assign destructured Array
                findClientById.policies = [...policies];

                //Assing to client data new array policies with objects and return response status 200
                const clientData = Object.assign([findClientById]);
                return res.status(200).json(clientData);
        }

        //Check condition if is true run code for admin
        if(role === "admin"){

            //Find client from data base by id 
            const findClientById =  dataClient.find(c => c.id === id);
            
            //If client not exist return 404 not found
            if(!findClientById) return res.status(404).send({message: "Not Found error."});
            
            //Create new array for objects policies
            const policies = []

            //Filter data policies and return by client id
            const findPoliciesById =  dataPolicies.filter(c => c.clientId === id);

            //Return new object data with value requeried
            findPoliciesById.map(p => {

                policies.push({
                    "id" : p.id,
                    "amountInsured" : p.amountInsured,
                    "inceptionDate": p.inceptionDate
                })
            })

            //Create value policie in user object and assign destructured Array
            findClientById.policies = [...policies];

            //Assing to client data new array policies with objects and return response status 200
            const clientData = Object.assign([findClientById]);
            return res.status(200).json(clientData);
            
        }   
    }catch(err){
        //If is error send to handler error what is in /src/app.js
        next(err);
    }
}

````

#Clients by ID and policies

Get the client's policies

```
Get /api/v1/clients/:id/policies
```

Can be accessed by client with role user and admin.

* User role.

````csharp
    {
        [] //Empty array becuase any user dont have policices assign
    }
````

* Admin role.

````csharp
 {
        "id": "7b624ed3-00d5-4c1b-9ab8-c265067ef58b",
        "amountInsured": "399.89",
        "email": "inesblankenship@quotezart.com",
        "inceptionDate": "2015-07-06T06:55:49Z",
        "installmentPayment": true
}
````

In folder `/src/controllers/clients.js` you can find middleware to this endpoint.

````csharp
//Get policies by client Id example URL:/api/v1/clients/a74c83c5-e271-4ecf-a429-d47af952cfd4/policies
const getPoliciesByClientId = async (req, res, next) => {
    try{
        //After veryfication get role from request
        const { role } = req.user;
        
        //Get client id from req.param
        const { id } = req.params;

        //Consume Api and get clients data 
        const dataClient = await getClients();

        //Consume Api and get policies data 
        const dataPolicies = await getPolicies();

        //Check is roles not exist throw 403 error
        if(!role) return res.status(403).send({message: 'Forbidden error'})

        //Check condition if is true run code for user
        if(role === "user"){

            //Filter client data and return array with only users clients
            const dataByRole = dataClient.filter(user => user.role === role);

            //If role not exist in data base return 404
            if(!dataByRole) return res.status(404).send({message: "Not Found error."});
           
            //Create new array for objects policies
            const policies = [];

            //Find client from data base by id 
            const getClientById = dataByRole.find(user => user.id === id);

            //If client not exist in data base return 404
            if(!getClientById) return res.status(404).send({message: "Not Found error."});

            //Filter data policies and return by client id
            const getPoliciesByClientId = dataPolicies.filter(policies => policies.clientId === getClientById.id);
            
            //Return new object data with value requeried
            getPoliciesByClientId.map(policie => {
                policies.push({
                    "id": policie.id,
                    "amountInsured": policie.amountInsured,
                    "email": policie.email,
                    "inceptionDate": policie.inceptionDate,
                    "installmentPayment": policie.installmentPayment
                })
            })

            //Return response with status 200 and policie
            return res.status(200).send(policies);
        }

        //Check condition if is true run code for user
        if(role === "admin"){

            //Filter client data and return array with only users clients
            const getClientById = dataClient.find(user => user.id === id);
            
            //If role not exist in data base return 404
            if(!getClientById) return res.status(404).send({message: "Not Found error."});
           
            //Create new array for objects policies
            const policies = [];
            
            //Filter data policies and return by client id
            const getPoliciesByClientId = dataPolicies.filter(policies => policies.clientId === getClientById.id);
            
            //Return new object data with value requeried
            getPoliciesByClientId.map(policie => {
                policies.push({
                    "id": policie.id,
                    "amountInsured": policie.amountInsured,
                    "email": policie.email,
                    "inceptionDate": policie.inceptionDate,
                    "installmentPayment": policie.installmentPayment
                })
            })

            //Return response with status 200 and policie
            return res.status(200).send(policies);
        }

    }catch(err){
        //If is error send to handler error what is in /src/app.js
        next(err);
    }
}
````