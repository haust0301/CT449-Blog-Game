const database_validators = require("./database-validators");
const generate_jwt = require("./generate-jwt");
const google_verify = require("./google-verify");
const manage_validator = require("./manage-validator")

module.exports = {
  ...database_validators,
  ...generate_jwt,
  ...google_verify,
  ...manage_validator
};
