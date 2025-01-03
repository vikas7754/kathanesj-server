const Header = require("../models/header");

const updateHeader = async (req, res) => {
  try {
    const { topText, bottomText } = req.body;
    if (!topText && !bottomText)
      return res.status(400).json({ message: "All fields are required!" });

    const header = await Header.findOne();
    if (!header) {
      const newHeader = new Header({ topText, bottomText });
      await newHeader.save();
      return res.status(200).json(newHeader);
    }

    header.topText = topText;
    header.bottomText = bottomText;
    await header.save();
    return res.status(200).json(header);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getHeader = async (req, res) => {
  try {
    const header = await Header.findOne();
    return res.status(200).json(header);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { updateHeader, getHeader };
