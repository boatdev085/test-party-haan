var jwt = require("jsonwebtoken");
const generateToken = (params) => {
  return jwt.sign(params, process.env.SECRET_KEY_JWT);
};
const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY_JWT);
};
module.exports = { verifyToken, generateToken };
