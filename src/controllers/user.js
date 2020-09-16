const { generateAccessToken } = require('../services/auth');

/**
 *
 * USER CONTROLLERS
 *
 * */

const clients = [{
  id: 1, username: 'test', password: 'test', role: 'user',
}, {
  id: 2, username: 'test2', password: 'test2', role: 'admin',
}];

// Verify user with clients normal will be data base
// eslint-disable-next-line consistent-return
const verifyUser = ({ username, password }) => {
  const user = clients.find((u) => u.username === username && u.password === password);

  if (user) {
    // eslint-disable-next-line no-shadow
    const { password, ...onlyUser } = user;
    return onlyUser;
  }
};

// login user with verification and function to generate access token
const login = (req, res, next) => {
  try {
    const data = req.body;
    const user = verifyUser(data);

    if (!user) res.status(401).send({ message: 'Username or password is not valid.' });

    const accessToken = generateAccessToken(user);

    res.status(200).send(accessToken);

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyUser,
  login,
};
