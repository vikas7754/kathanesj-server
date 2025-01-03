const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    data: {
      type: [
        {
          label: {
            type: String,
          },
          value: {
            type: String,
          },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Details = mongoose.model("Details", detailsSchema);
module.exports = Details;
