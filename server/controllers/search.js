const { ObjectId } = require("mongoose").Types;
const Game = require("../models/game");

const allowedCollections = ["games"];

const searchGames = async (term = "", req, res) => {
  const isMongoID = ObjectId.isValid(term);
  if (isMongoID) {
    const game = await Game.findById(term).populate("category", "name");
    return res.json({
      total: 12,
      results: game ? [game] : [],
    });
  }

  const { page = 1, limit = 10 } = req.query;
  const skipIndex = (Number(page) - 1) * limit;

  const regex = new RegExp(term, "i"); //i: Ignore case
  const query = {
    $or: [{ title: regex }, { description: regex }],
    $and: [{ status: true }],
  };

  const [total, games] = await Promise.all([
    Game.countDocuments(query),
    Game.find(query)
      .populate("category", "name")
      .limit(Number(limit))
      .skip(skipIndex),
  ]);

  res.json({
    total,
    results: games,
  });
};

const search = (req, res) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Allowed collections are: ${allowedCollections}`,
    });
  }

  switch (collection) {
    case "games":
      searchGames(term, req, res);
      break;
    default:
      res.status(500).json({
        msg: "Please contact an administrator!",
      });
      break;
  }
};

module.exports = {
  search,
};
