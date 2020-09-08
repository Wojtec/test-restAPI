const { getPolicies }= require('../actions');


// Get policies with query limit example: /api/v1/policies?limit=10
const getPoliciesData = async (req, res) => {
    try{
        const { limit } = req.query;
        const data = await getPolicies();
        const limitData = data.slice(0, limit || 10);
        res.status(200).json(limitData);
    }catch(err){
        console.error(err);
    }
}

// Get policies by Id example:/api/v1/policies/e8fd159b-57c4-4d36-9bd7-a59ca13057bb
const getPoliciesById = async (req, res) => {
    try{
        const { id } = req.params;
        const data = await getPolicies();
        const findById =  data.find(p => p.id === id);
        if(findById) {
            res.status(200).json(findById);
        }
    }catch(err){
        console.error(err);
    }
}

module.exports = {
    getPoliciesData,
    getPoliciesById
}