const validateFile = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({ msg: "No files were uploaded." });
  }
  if (
    req.files.file.mimetype != "image/jpeg" &&
    req.files.file.mimetype != "image/png"
  ) {
    return res
      .status(400)
      .json({ msg: "File type is not allowed. Valid types: JPG, JPEG, PNG." });
  }
  if (req.files.file.size > 1500000) {
    return res.status(400).json({ msg: "File size cannot be larger than 1.5MB." });
  }
  next();
};

module.exports = {
  validateFile,
};
