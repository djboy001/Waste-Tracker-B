const mongoose = require("mongoose");

const VolSchema = new mongoose.Schema(
  {
    pinId: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'Pin',
      required: true,
      unique:true
    },
    userIds: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}]
  },
  { timestamps: true }
);
module.exports = mongoose.model("Volunteer", VolSchema);
module.exports.VolSchema = VolSchema;


