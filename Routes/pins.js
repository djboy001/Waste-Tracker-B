const router = require("express").Router();
const { request } = require("express");
const mongoose = require("mongoose")
const Pin = require("../models/Pin");
const axios = require("axios");
const UserSchema = require("../models/User");
const User = mongoose.model("User", UserSchema);
const Volunteer = require("../models/Volunteer");
const { addUsernameInPins, getUserObj } = require("../helper/extraFunction");

//create a pin
router.post("/", async (req, res) => {
  const userObj = await User.findOne({username:req.body.username})
  if(!userObj) return res.status(500).json("User Not Exists"); 
  delete req.body['username'];
  req.body.userId = userObj._id;
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//get all pins
router.get("/", async (req, res) => {
  try {
    var pins = await Pin.find();
    for(let i=0;i<pins.length;i++) pins[i] = await addUsernameInPins(pins[i]); 
    res.status(200).json(pins);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

//single pin data
router.get("/pindata/:pin_id", async (req, res) => {
  try {
    var pin = await Pin.findOne({_id:req.params.pin_id});
    pin = await addUsernameInPins(pin)
    res.status(200).json(pin);
  } catch (err) {
    res.status(500).json(err.message);
  }
});


//delete pin
router.delete("/:pin_id", async (req, res) => {
  try {
    await Pin.findByIdAndDelete(req.params.pin_id)
    await Volunteer.deleteOne({pinId: req.params.pin_id})
    res.status(200).json("Deleted successfully")
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
