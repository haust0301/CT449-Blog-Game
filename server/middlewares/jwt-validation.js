const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req, res, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "The request contains no token.",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        msg: "User doesn't exists.",
      });
    }

    if (!user.status) {
      return res.status(401).json({
        msg: "User is deleted.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Invalid token.",
    });
  }
};

module.exports = {
  validateJWT,
};
