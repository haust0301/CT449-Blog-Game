const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const usersGet = async (req, res) => {
  const { limit = 10 } = req.query;
  const query = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).limit(Number(limit)),
  ]);

  res.json({ total, users });
};

const usersGetByID = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.json(user);
};

const usersPost = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({
    name,
    email,
    password,
    role,
  });

  // Encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();
  res.json(user);
};

const usersPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, status, ...oldUser } = req.body;

  if (password) {
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    oldUser.password = bcryptjs.hashSync(password, salt);
  }

  const newUser = await User.findByIdAndUpdate(id, oldUser, { new: true });
  res.json(newUser);
};

const usersDelete = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json({ user });
};

module.exports = {
  usersGet,
  usersGetByID,
  usersPost,
  usersPut,
  usersDelete,
};
