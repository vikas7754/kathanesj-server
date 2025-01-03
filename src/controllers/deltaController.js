const Delta = require("../models/delta");

const addDelta = async (req, res) => {
  try {
    if (!req.body.product || !req.body.amount) {
      return res
        .status(400)
        .json({ message: "Product and amount are required" });
    }

    const product = req.body.product.toLowerCase().trim();
    const amount = req.body.amount.toLowerCase().trim();

    const existingDelta = await Delta.findOne({ product });
    if (existingDelta) {
      return res
        .status(400)
        .json({ message: `Delta price for ${product} is already exist!` });
    }

    const delta = new Delta({ product, amount });
    await delta.save();
    return res.status(201).json(delta);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateDelta = async (req, res) => {
  try {
    const { product, amount } = req.body;
    const delta = await Delta.findOneAndUpdate(
      { product },
      { product, amount },
      { new: true }
    );
    return res.status(200).json(delta);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteDelta = async (req, res) => {
  try {
    const { product } = req.params;
    await Delta.findOneAndDelete({ product });
    return res.status(200).json({ message: "Delta deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDelta = async (req, res) => {
  try {
    const { product } = req.params;
    const delta = await Delta.findOne({ product });
    return res.status(200).json(delta);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllDelta = async (req, res) => {
  try {
    const delta = await Delta.find();
    return res.status(200).json(delta);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addDelta,
  updateDelta,
  deleteDelta,
  getDelta,
  getAllDelta,
};
