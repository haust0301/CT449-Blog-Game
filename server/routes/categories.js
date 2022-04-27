const { Router } = require("express");
const { categoriesGet, categoryPost } = require("../controllers/categories");

const router = Router();

// Routes
router.get("/", categoriesGet);
router.post("/",categoryPost);

module.exports = router;