const { Router } = require("express");
const { check } = require("express-validator");

const { fieldValidation } = require("../middlewares");
const { emailExists } = require("../helpers");

const { register, login, googleSignIn } = require("../controllers/auth");

const router = Router();

router.post(
  "/register",
  [
    check("name", "Name is required.").not().isEmpty(),
    check("name", "Name must be between 2 to 32 characters.").isLength({
      min: 2,
      max: 32,
    }),
    check(
      "password",
      "Password must be at least 8 characters long and must contain letters in mixed case, numbers and special characters."
    ).isStrongPassword(),
    check("passwordConfirmation", "Passwords don't match.").custom(
      (value, { req }) => value === req.body.password
    ),
    check("email", "Invalid email.").isEmail(),
    check("email").custom(emailExists),
    fieldValidation,
  ],
  register
);

router.post(
  "/login",
  [
    check("email", "Email is required.").isEmail(),
    check("password", "Password is required.").not().isEmpty(),
    fieldValidation,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "Google token is required.").not().isEmpty(),
    fieldValidation,
  ],
  googleSignIn
);


module.exports = router;
