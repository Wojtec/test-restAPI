const { getPolicies } = require('../actions');

/**
 *
 * POLICIES CONTROLLERS
 *
 * */

// Get policies with query limit example: /api/v1/policies?limit=10
// eslint-disable-next-line consistent-return
const getPoliciesData = async (req, res, next) => {
  try {
    const policies = [];
    const { limit } = req.query;
    const data = await getPolicies();
    const limitData = data.slice(0, limit || 10);

    limitData.map((p) => {
      const { clientId, ...withoutClientId } = p;

      return policies.push(withoutClientId);
    });

    return res.status(200).json(policies);
  } catch (err) {
    next(err);
  }
};

// Get policies by Id example:/api/v1/policies/e8fd159b-57c4-4d36-9bd7-a59ca13057bb
// eslint-disable-next-line consistent-return
const getPoliciesById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getPolicies();
    const findById = data.find((p) => p.id === id);

    if (!findById) return res.status(404).send({ message: 'Not Found error' });

    return res.status(200).json(findById);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPoliciesData,
  getPoliciesById,
};
