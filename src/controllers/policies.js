const { getPolicies }= require('../actions');

const getPoliciesData = async (req, res) => {
    const { limit } = req.query;
    console.log(limit);
    const data = await getPolicies();
    const limitData = data.slice(0, limit);
    res.status(200).json(limitData);

}

module.exports = {
    getPoliciesData
}