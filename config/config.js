module.exports = {
  secret_key: process.env.SECRET_KEY_JWT || "partyhaan",
  RESPONSE_SUCCESS: {
    code: 200,
    message: "success",
    description: "success",
  },
  RESPONSE_ERROR: {
    code: 404,
    message: "fail",
    description: "fail",
  },
};
