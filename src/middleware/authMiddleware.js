const { validateJSONToken } = require('../util/auth.js');
require('dotenv').config();

const authMiddleware = () => (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(403).send('Token is required');
  }

  const authToken = authorization.split(' ')[1];
  try {
    const decoded = validateJSONToken(authToken);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
};

module.exports = authMiddleware;