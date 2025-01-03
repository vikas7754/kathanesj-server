const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chargesSchema = new Schema({
  making: {
    type: [
      {
        category: {
          type: String,
          required: true,
          trim: true,
        },
        charge: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  hallMarking: {
    type: Number,
    required: true,
  },
  packing: {
    type: Number,
    required: true,
  },
  gst: {
    type: Number,
    required: true,
  },
});

const Charges = mongoose.model("Charges", chargesSchema);
module.exports = Charges;
