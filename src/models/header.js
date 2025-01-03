const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const headerSchema = new Schema({
  topText: {
    type: {
      text: String,
      duration: Number,
    },
  },
  bottomText: {
    type: {
      text: String,
      duration: Number,
    },
  },
});

module.exports = mongoose.model("Header", headerSchema);
