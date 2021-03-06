const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 *
 * AUTHORIZATION SERVICE
 *
 * 1.Function generateAccessToken create new token with user payload.
 * 2.Function verifyToken is checking Authorization header and verifying token
 *
 * */

// Generate access token
const generateAccessToken = (user) => {
  const exp = Math.floor(Date.now() / 1000) + (60 * 60);

  const token = jwt.sign(user, config.secret, {
    algorithm: 'HS256',
    expiresIn: exp,
  });

  return { token, type: 'Bearer', expiresIn: exp };
};

// Verify token access
// eslint-disable-next-line consistent-return
const verifyToken = (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader && bearerHeader.split(' ')[1];

    if (!token) return res.status(401).send({ message: 'Unauthorized' });

    // eslint-disable-next-line consistent-return
    jwt.verify(token, config.secret, (err, user) => {
      if (err) return res.status(401).send({ message: 'Token is not valid' });

      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyToken,
  generateAccessToken,
};
