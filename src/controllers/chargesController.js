const Charges = require("../models/charge");

const addCharges = async (req, res) => {
  try {
    const charges = await Charges.findOne();
    if (charges) {
      await Charges.findByIdAndUpdate(charges._id, req.body);
      return res.status(200).json({ message: "Charges updated successfully!" });
    }
    const newCharges = new Charges(req.body);
    const savedCharges = await newCharges.save();
    return res.status(201).json(savedCharges);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getCharges = async (req, res) => {
  try {
    const charges = await Charges.findOne();
    return res.status(200).json(charges);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addCharges,
  getCharges,
};
