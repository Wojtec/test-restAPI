const { getClients } = require('../actions');
const { getPolicies }= require('../actions');



//Get clients by roles and filter by query limit and name example URL:/api/v1/clients?limit=5&name=Manning
const getClientsData = async (req, res) => {
    try{
        const { role } = req.user;
        const { limit, name } = req.query;
        const data = await getClients();
    
        if(role === "user"){
            const dataByRole = data.filter(user => user.role === role);
            
            if(limit || name ){
                const findByName = name ? dataByRole.filter(user => user.name === name) : dataByRole;
                const limitData = findByName ? findByName.slice(0, limit) : dataByRole.slice(0, limit);
               return res.status(200).json(limitData);
            }
    
           return res.status(200).json(dataByRole);
        }
    
        if(role === "admin"){
            if(limit || name ){
                const findByName = name ? data.filter(user => user.name === name) : data;
                const limitData = findByName ? findByName.slice(0, limit) : data.slice(0, limit);
               return res.status(200).json(limitData);
            }
    
          return  res.status(200).json(data);
        }

    }catch(err){
        console.error(err);
    }
}

//Get clients by roles and by ID with policies example URL: /api/v1/clients/a0ece5db-cd14-4f21-812f-966633e7be86
const getClientsById = async (req, res) => {
    try{
        const { role } = req.user;
        const { id } = req.params;
        const dataClient = await getClients();
        const dataPolicies = await getPolicies();

        if(role === "user"){
            const dataByRole = dataClient.filter(user => user.role === role);

            if(!dataByRole) return res.status(404).send({message: "Not Found error."});
            
            if(dataByRole){
                const findClientById =  dataByRole.find(c => c.id === id);

                if(!findClientById) return res.status(401).send({message: "You don't have authorization to check this data."});

                if(findClientById) {
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
            }
        }

        if(role === "admin"){
            const findClientById =  dataClient.find(c => c.id === id);

            if(!findClientById) return res.status(404).send({message: "Not Found error."});
            
            if(findClientById) {
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
        }   

    }catch(err){
        console.error(err);
    }
}


module.exports = {
    getClientsData,
    getClientsById
}