const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deltaSchema = new Schema({
  product: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  amount: {
    type: Number,
    default: 0,
    required: true,
  },
});

const Delta = mongoose.model("Delta", deltaSchema);
module.exports = Delta;
