const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Game = require("../models/game");

const checkCanManage = async (req, res, next) => {
  let canManage = false;
  const token = req.header("x-token");
  if (token) {
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const [user, game] = await Promise.all([
        User.findById(id),
        Game.findById(req.params.id).populate("user"),
      ]);
      if (user && user.status) {
        req.user = user;
        roles = ["admin"];
        if (game.user.id === req.user.id || roles.includes(req.user.role)) {
          canManage = true;
        }
      }
    } catch (err) {

    }
  }
  req.canManage = canManage;
  next();
};

module.exports = {
  checkCanManage,
};
