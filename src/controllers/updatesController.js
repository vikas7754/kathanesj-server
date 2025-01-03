const Update = require("../models/update");

const addUpdate = async (req, res) => {
  try {
    const { title, message } = req.body;
    const update = new Update({ title, message });
    await update.save();
    return res.status(201).json(update);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUpdate = async (req, res) => {
  try {
    const { title, message } = req.body;
    const { id } = req.params;
    const update = await Update.findByIdAndUpdate(
      id,
      { title, message },
      { new: true }
    );
    return res.status(200).json(update);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    await Update.findByIdAndDelete(id);
    return res.status(200).json({ message: "Update deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUpdates = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const skip = limit * (page - 1);
  try {
    const updates = await Update.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    const total = await Update.countDocuments({});
    return res.status(200).json({ updates, total });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addUpdate,
  updateUpdate,
  deleteUpdate,
  getUpdates,
};
