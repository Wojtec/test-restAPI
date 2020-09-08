const { getPolicies }= require('../actions');

const getPoliciesData = async (req, res) => {
    const data = await getPolicies();
    res.status(200).json(data);

}

module.exports = {
    getPoliciesData
}