const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const Config = require("../config/config");
const handleFetch = async (url, { method = "GET", body = {} }) => {
  try {
    let options = {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    if (method === "POST") {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options).then(async (res) => res.json());
    return response;
  } catch (e) {
    return { ...Config.RESPONSE_ERROR, message: e.message };
  }
};
const saltRounds = 12;
const encode = (data) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashed = bcrypt.hashSync(data, salt);
  return hashed;
};
const compare = (hashed, data) => {
  return bcrypt.compareSync(data, hashed);
};
const generateJWT = (obj, expires = "24h") => {
  return JWT.sign(obj, Config.secret_key, {
    expiresIn: expires,
    algorithm: "HS256",
  });
};
module.exports = { handleFetch, encode, compare, generateJWT };
