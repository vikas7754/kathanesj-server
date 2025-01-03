const Details = require("../models/details");

const getDetails = async (req, res) => {
  try {
    const { title } = req.query;
    const details = await Details.findOne({ title });
    return res.status(200).json(details);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addDetails = async (req, res) => {
  try {
    const { title, data } = req.body;
    const details = new Details({ title, data });
    await details.save();
    return res.status(201).json(details);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateDetails = async (req, res) => {
  try {
    const { title, data } = req.body;
    const details = await Details.findOneAndUpdate(
      { title },
      { data },
      { new: true }
    );
    return res.status(200).json(details);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteDetails = async (req, res) => {
  try {
    const { title } = req.query;
    await Details.deleteOne({ title });
    return res.status(200).json({ message: "Details deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDetails,
  addDetails,
  updateDetails,
  deleteDetails,
};
