const router = require("express").Router();
const { request } = require("express");
const mongoose = require("mongoose")
const Pin = require("../models/Pin");
const axios = require("axios");
const UserSchema = require("../models/User");
const User = mongoose.model("User", UserSchema);

const addUsernameInPins = async (pin)=>{
    pin = pin.toObject();
    const user = await User.findOne({userId:pin.userId})
    pin.username = user.username;
    return pin;
}

const getPinObj = async (filter) =>{
    const pinObj = await Pin.findOne(filter); //filter = {_id:pinId}
    return pinObj;
}

const getUserObj = async (filter) => {
    const userObj = await User.findOne(filter); //filter = {username:username}, {_id:userId}
    return userObj
}

module.exports = {addUsernameInPins, getPinObj, getUserObj}