const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const Game = require("../models/game");
const folder = "Game-blog";

const updateImageCloudinary = async (req, res) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "games":
      model = await Game.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Game ID ${id} does not exist`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Please, contact your administrator.",
      });
  }

  const oldImage = model.img;
  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(
    tempFilePath,
    // (allowed_formats = ["jpg", "png", "jpeg"]),
    {
      folder,
    }
  );
  model.img = secure_url;
  await model.save();

  if (oldImage) {
    const arrayName = oldImage.split("/");
    const name = arrayName[arrayName.length - 1];
    const [public_id] = name.split(".");
    cloudinary.uploader.destroy(folder + "/" + public_id);
  }

  res.status(201).json({
    model,
  });
};

const showImage = async (req, res) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "games":
      model = await Game.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Game ID ${id} doesn't exists`,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Please, contact your administrator.",
      });
  }
  if (model.img) {
    return res.redirect(model.img);
  }

  const placeholderImage = path.join(__dirname, "../assets/no-image.jpg");
  if (fs.existsSync(placeholderImage)) {
    return res.sendFile(placeholderImage);
  }
};

module.exports = {
  showImage,
  updateImageCloudinary,
};
