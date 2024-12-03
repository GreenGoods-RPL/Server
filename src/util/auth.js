const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateJWTToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, {
    expiresIn: "6h",
  });
};

const validateJSONToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
}

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = { generateJWTToken, validateJSONToken, hashPassword, comparePassword };