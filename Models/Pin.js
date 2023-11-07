const mongoose = require("mongoose");
const PinSchema = new mongoose.Schema(
  {
    userId: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: String,
    desc: String,
    img: {
      url: String,
      public_id: String,
    },
    long: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pin", PinSchema);
module.exports.PinSchema = PinSchema;
