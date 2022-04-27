const bcryptjs = require("bcryptjs");
const { generateJWT, googleVerify } = require("../helpers");
const User = require("../models/user");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({
    name,
    email,
    password,
    role: "user",
  });

  // Encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();
  
  // Generate JWT
  const token = await generateJWT(user.id);

  res.json({
    user,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        msg: "Email is not registered.",
      });
    }

    // User status is true
    if (!user.status) {
      return res.status(400).json({
        msg: "User is deleted.",
      });
    }

    // Verify if passwords match
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        msg: "Invalid password.",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Authentication error. Please, contact an Administrator!",
      error,
    });
  }
};

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;
  try {
    const { name, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    // If user doesn't exists
    if (!user) {
      const userData = {
        name,
        email,
        password: "Google",
        google: true,
        role: "user",
      };
      user = new User(userData);
      await user.save();
    }

    // If user is deleted
    if (!user.status) {
      return res.status(401).json({
        msg: "User is deleted.",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      msg: "Token could not be verified",
    });
  }
};

module.exports = {
  register,
  login,
  googleSignIn
};
