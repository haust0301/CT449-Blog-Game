const { Schema, model } = require("mongoose");

const GameSchema = Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  img: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0
  },
  status: {
    type: Boolean,
    default: true,
  },
  date_added: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
});

GameSchema.methods.toJSON = function () {
  const { __v, ...game } = this.toObject();
  return game;
};

module.exports = model("Game", GameSchema);
