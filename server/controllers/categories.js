const Category = require("../models/category");

const categoriesGet = async (req, res) => {
  const [total, categories] = await Promise.all([
    Category.countDocuments(),
    Category.find(),
  ]);

  res.json({ total, categories });
};

const categoryPost = async (req, res) => {
  const { name } = req.body;

  const category = new Category({
    name,
  });

  await category.save();
  res.status(201).json({ category });
};

module.exports = {
  categoriesGet,
  categoryPost
};
