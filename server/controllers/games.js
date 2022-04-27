const Game = require("../models/game");
const UserLike = require("../models/user_like");

const gamesGet = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skipIndex = (Number(page) - 1) * limit;
  const query = { status: true };

  const [total, games] = await Promise.all([
    Game.countDocuments(query),
    Game.find(query).sort({ date_added: 1 }).limit(Number(limit)).skip(skipIndex),
  ]);

  res.json({ total, games });
};

const gamesGetPopular = async (req, res) => {
  const { limit = 10 } = req.query;
  const query = { status: true };

  const games = await Game.find(query).sort({ likes: -1 }).limit(Number(limit));

  res.json({ games });
};

const gamesGetOwned = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skipIndex = (Number(page) - 1) * limit;
  const query = { user: req.user.id };

  const [total, games] = await Promise.all([
    Game.countDocuments(query),
    Game.find(query).sort({ date_added: -1 }).limit(Number(limit)).skip(skipIndex),
  ]);

  res.json({ total, games });
};

const gamesGetLiked = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skipIndex = (Number(page) - 1) * limit;
  const query = { user: req.user.id };

  const [total, games] = await Promise.all([
    UserLike.countDocuments(query),
    UserLike.find(query)
      .populate("game")
      .sort({ date_liked: -1 })
      .limit(Number(limit))
      .skip(skipIndex),
  ]);

  res.json({
    total,
    games: games.map((a) => a.game),
  });
};

const gamesGetById = async (req, res) => {
  const { id } = req.params;
  let query = {};

  if (req.user) {
    query = { game: id, user: req.user.id };
  }

  const [game, likes] = await Promise.all([
    Game.findById(id).populate("category", "name").populate("user", "name"),
    UserLike.findOne(query),
  ]);

  const liked = likes && req.user ? true : false;

  res.json({ game, canManage: req.canManage, liked });
};

const gamesPost = async (req, res) => {
  const user = req.user;
  const { title, description, category } = req.body;

  const game = new Game({
    title,
    description,
    category,
    user: user._id,
  });

  await game.save();
  res.status(201).json({ game });
};

const gamesPut = async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;
  const newGame = await Game.findByIdAndUpdate(
    id,
    {
      title,
      description,
      category,
    },
    { new: true }
  );
  res.status(201).json({ newGame });
};

const gamesDelete = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findByIdAndUpdate(
    id,
    {
      status: false,
    },
    { new: true }
  );
  res.json({ game });
};

const gamesUndelete = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findByIdAndUpdate(
    id,
    {
      status: true,
    },
    { new: true }
  );
  res.json({ game });
};

const gamesLike = async (req, res) => {
  const { id } = req.params;
  const query = { user: req.user.id, game: id };

  let userLike = await UserLike.findOne(query);
  const liked = userLike ? false : true;

  if (!userLike) {
    userLike = new UserLike(query);
    await Promise.all([
      userLike.save(),
      Game.findByIdAndUpdate(id, { $inc: { likes: 1 } }),
    ]);
  } else {
    await Promise.all([
      userLike.remove(),
      Game.findByIdAndUpdate(id, { $inc: { likes: -1 } }),
    ]);
  }

  res.status(201).json({ liked });
};

module.exports = {
  gamesGet,
  gamesGetPopular,
  gamesGetOwned,
  gamesGetLiked,
  gamesGetById,
  gamesPost,
  gamesPut,
  gamesDelete,gamesUndelete,
  gamesLike,
};
