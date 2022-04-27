const { Router } = require("express");
const { check } = require("express-validator");

const { fieldValidation, validateJWT, hasRole } = require("../middlewares");
const { emailExists, userExistsById } = require("../helpers");

const {
  usersGet,
  usersGetByID,
  usersPost,
  usersPut,
  usersDelete,
} = require("../controllers/users");

const router = Router();

// Routes
router.get("/", usersGet);

router.get(
  "/:id",
  [
    check("id", "Invalid user ID.").isMongoId(),
    fieldValidation,
    check("id").custom(userExistsById),
    fieldValidation,
  ],
  usersGetByID
);

module.exports = router;
