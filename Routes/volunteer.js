const router = require("express").Router();
const Volunteer = require("../models/Volunteer");
const Pin = require("../models/Pin");
const { VolSchema } = require("../models/Volunteer");
const mongoose = require("mongoose");
const userSchema = require("../models/User");
const User = mongoose.model("User", userSchema);
const { getPinObj, getUserObj } = require("../helper/extraFunction");
const { get } = require("./volunteer");



//create a volunteer
router.post("/:currentPlaceId", async (req, res) => {
  try {
    
    const user  = await getUserObj({username:req.body.username});
    if(!user) throw { message:"User not exists" };
    if(!req.params.currentPlaceId) throw {message:"Pin is not defined!"};
    const vol_status = await Volunteer.findOneAndUpdate(
      { $and: [{ pinId: req.params.currentPlaceId }, { userIds: { $in: [user._id] } }] },
      { $pull: { userIds: user._id } },
      { new: true }
    ); 
    if(!vol_status){
      const vol_status_2 = await Volunteer.findOneAndUpdate(
        { pinId: req.params.currentPlaceId },
        { $push: { userIds: user._id } },
        { new: true }
      ); 
      if(!vol_status_2){
        const newVol = new Volunteer({
          pinId: req.params.currentPlaceId,
          userIds: [user._id],
        });
        newVol.save((err, results)=>{
          if(err){
            res.status(500).json(err.message);
            console.log(err);
          }else{
            res.status(200).json("Volunteer added successfully");
            console.log("Volunteer added successfully");
          }
        });
      }else res.status(200).json("Volunteer added successfully");
    }else res.status(200).json("Volunteer remove successfully");
    // if (volObj) {
    //   const volres = await Volunteer.updateOne({ pinId: req.body.pin_id }, { $pull: { userIds: user._id } });
    //   res.status(200).json("You are not volunteer now");
    //   console.log("You are not volunteer now");
    // } else {
    //   // const user = await User.findOne({ username: req.body.username });
    //   const newVol = new Volunteer({
    //     pinId: req.body.pin_id,
    //     userIds: [user._id],
    //   });
    //   newVol.save((err, results)=>{
    //     if(err){
    //       res.status(500).json(err.message);
    //       console.log(err);
    //     }else{
    //       res.status(200).json("Volunteer added successfully");
    //       console.log("Volunteer added successfully");
    //     }
    //   });
    // }
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

//get all volunteers on specific place id
router.get("/:currentPlaceId", async (req, res) => {
  try {
    var { userIds } = await Volunteer.findOne({ pinId: req.params.currentPlaceId });
    userIds = userIds.toObject();
    for(let i=0;i < userIds.length;i++) userIds[i] = await getUserObj({_id:userIds[i]}); 
    res.status(200).json(userIds);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//get all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.delete("/:currentPlaceId", async (req, res) => {
  try {
    Volunteer.deleteMany({ pinId: req.params.currentPlaceId }, (err, result) => {
      if (err) {
        res.status(500).json(err.message);
      } else {
        res.status(200).json("Deleted volunteers of this location");
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
