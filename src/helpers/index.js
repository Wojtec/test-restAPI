const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const actions = require('../actions');

/**
 *  HELPERS FUNCTIONS
 *
 *  1.Funciton readToken for read token from API integration is stored in apiData.json .
 *  2.Function refreshToken is checking time of API token if is expired is generate new token.
 *
 * */

// Read token from file authData.json
// eslint-disable-next-line consistent-return
const readToken = async () => {
  try {
    const readFile = await fs.readFile('./apiData.json');
    const data = JSON.parse(readFile);
    const { token } = data;
    return token;
  } catch (err) {
    console.error(err);
  }
};

// Check if API token is expired
// eslint-disable-next-line consistent-return
const refreshToken = async (token) => {
  try {
    const decodeToken = jwt.decode(token, { complete: true });
    const { payload } = decodeToken;

    if (Date.now() >= payload.exp * 1000) {
      const newToken = await actions.loginApi();

      return newToken;
    }

    return token;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  readToken,
  refreshToken,
};
