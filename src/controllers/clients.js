const { getClients } = require('../actions');
const { getPolicies }= require('../actions');


//Get clients by roles and filter by query limit and name example URL:/api/v1/clients?limit=5&name=Manning
const getClientsData = async (req, res, next) => {
    try{
        const { role } = req.user;
        const { limit, name } = req.query;
        const data = await getClients();
        const dataPolicies = await getPolicies();

        if(!role) return res.status(403).send({message: 'Forbidden error'})

        if(role === "user"){
            const dataByRole = data.filter(user => user.role === role);

            dataByRole.map(user => {
                const objPolice = [];
                const policies = dataPolicies.filter(u => u.clientId === user.id);

                policies.map(p => {
                     objPolice.push({
                        id: p.id,
                        amountInsured: p.amountInsured,
                        inceptionDate: p.inceptionDate
                    })
                })

                user.policie = [...objPolice];
             })
           
            if(limit || name ){
                const findByName = name ? dataByRole.filter(user => user.name === name) : dataByRole;
                const limitData = findByName ? findByName.slice(0, limit) : dataByRole.slice(0, 10);
               
                return res.status(200).json(limitData);
            }

            const limitedByDefault = dataByRole.slice(0, 10);
            return res.status(200).json(limitedByDefault);
        }
    
        if(role === "admin"){

            data.map(user => {
                const objPolice = [];
                const policies = dataPolicies.filter(u => u.clientId === user.id);

                policies.map(p => {
                    objPolice.push({
                        id: p.id,
                        amountInsured: p.amountInsured,
                        inceptionDate: p.inceptionDate
                    })
                })

                user.policie = [...objPolice];
             })

            if(limit || name ){
                const findByName = name ? data.filter(user => user.name === name) : data;
                const limitData = findByName ? findByName.slice(0, limit) : data.slice(0, 10);

                return res.status(200).json(limitData);
            }
    
          return  res.status(200).json(data);
        }
    }catch(err){
        next(err);
    }
}

//Get clients by roles and by ID with policies example URL: /api/v1/clients/a0ece5db-cd14-4f21-812f-966633e7be86
const getClientsById = async (req, res, next) => {
    try{
        const { role } = req.user;
        const { id } = req.params;
        const dataClient = await getClients();
        const dataPolicies = await getPolicies();

        if(!role) return res.status(403).send({message: 'Forbidden error'})

        if(role === "user"){
            const dataByRole = dataClient.filter(user => user.role === role);
            
            if(!dataByRole) return res.status(404).send({message: "Not Found error."});

            const findClientById =  dataByRole.find(c => c.id === id);

            if(!findClientById) return res.status(404).send({message: "Not Found error."});

            const policies = []
            const findPoliciesById =  dataPolicies.filter(c => c.clientId === id);

            findPoliciesById.map(p => {

                policies.push({
                    "id" : p.id,
                    "amountInsured" : p.amountInsured,
                    "inceptionDate": p.inceptionDate
                })
            })

            findClientById.policies = [...policies];
            const clientData = Object.assign([findClientById]);
            return res.status(200).json(clientData);
        }

        if(role === "admin"){
            const findClientById =  dataClient.find(c => c.id === id);
            
            if(!findClientById) return res.status(404).send({message: "Not Found error."});
            
            const policies = []
            const findPoliciesById =  dataPolicies.filter(c => c.clientId === id);

            findPoliciesById.map(p => {

                policies.push({
                    "id" : p.id,
                    "amountInsured" : p.amountInsured,
                    "inceptionDate": p.inceptionDate
                })
            })

            findClientById.policies = [...policies];
            const clientData = Object.assign([findClientById]);
            return res.status(200).json(clientData);
            
        }   
    }catch(err){
        next(err);
    }
}

//Get policies by client Id example URL:/api/v1/clients/a74c83c5-e271-4ecf-a429-d47af952cfd4/policies
const getPoliciesByClientId = async (req, res, next) => {
    try{
        const { role } = req.user;
        const { id } = req.params;
        const dataClient = await getClients();
        const dataPolicies = await getPolicies();

        if(!role) return res.status(403).send({message: 'Forbidden error'})

        if(role === "user"){
            const dataByRole = dataClient.filter(user => user.role === role);
           
            if(!dataByRole) return res.status(404).send({message: "Not Found error."});
           
            const policies = [];
            const getClientById = dataByRole.find(user => user.id === id);

            if(!getClientById) return res.status(404).send({message: "Not Found error."});

            const getPoliciesByClientId = dataPolicies.filter(policies => policies.clientId === getClientById.id);
            
            getPoliciesByClientId.map(policie => {
                policies.push({
                    "id": policie.id,
                    "amountInsured": policie.amountInsured,
                    "email": policie.email,
                    "inceptionDate": policie.inceptionDate,
                    "installmentPayment": policie.installmentPayment
                })
            })

            return res.status(200).send(policies);
        }

        if(role === "admin"){
            const getClientById = dataClient.find(user => user.id === id);
            
            if(!getClientById) return res.status(404).send({message: "Not Found error."});
           
            const policies = [];
            const getPoliciesByClientId = dataPolicies.filter(policies => policies.clientId === getClientById.id);
            
            getPoliciesByClientId.map(policie => {
                policies.push({
                    "id": policie.id,
                    "amountInsured": policie.amountInsured,
                    "email": policie.email,
                    "inceptionDate": policie.inceptionDate,
                    "installmentPayment": policie.installmentPayment
                })
            })

            return res.status(200).send(policies);
        }

    }catch(err){
        next(err);
    }
}

module.exports = {
    getClientsData,
    getClientsById,
    getPoliciesByClientId
}