const field_validation = require("./field-validation");
const file_validation = require("./file-validation");
const jwt_validation = require("./jwt-validation")
const password_validation = require("./password-validation")
const role_validation = require("./role-validation");

module.exports = {
  ...field_validation,
  ...file_validation,
  ...role_validation,
  ...password_validation,
  ...jwt_validation
}