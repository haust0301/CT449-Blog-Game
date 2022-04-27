const { Router } = require("express");
const { check } = require("express-validator");
const { showImage, updateImageCloudinary } = require("../controllers/uploads");

const { allowedCollections } = require("../helpers");
const { validateJWT, validateFile, fieldValidation } = require("../middlewares");

const router = Router();

router.put(
  "/:collection/:id",
  [
    validateJWT,
    validateFile,
    check("id", "Invalid ID.").isMongoId(),
    fieldValidation,
    check("collection").custom((c) => allowedCollections(c, ["games"])),
    fieldValidation,
  ],
  updateImageCloudinary
);

router.get(
  "/:collection/:id",
  [
    check("id", "Invalid ID.").isMongoId(),
    fieldValidation,
    check("collection").custom((c) => allowedCollections(c, ["games"])),
    fieldValidation,
  ],
  showImage
);

module.exports = router;
