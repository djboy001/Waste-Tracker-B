const userSchema = require("../models/User");
const router = require("express").Router();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());

//REGISTER
router.post("/register", async (req, res) => {
  try {
    if(!req.body.username || !req.body.password) throw { message: "Username or Password is incorrect" };
    req.body.username = req.body.username.toLowerCase();
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      // password: req.body.password,
    });
    User.register(newUser, req.body.password, function (err, user) {
      if (err) {
        console.log(err);
        res.status(500).json(err.message);
      } else {
        passport.authenticate("local")(req, res, () => {
          res.status(200).json(user._id);
        });
      }
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    //find user
    if(!req.body.username || !req.body.password) throw { message: "Username or Password is incorrect" };
    req.body.username = req.body.username.toLowerCase();
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json("Wrong username or password");
      return;
    }
    //validate password
    req.login(user, async (err) => {
      if (err) {
        console.log(err);
        res.status(500).json(err.message);
      }
      else {
        passport.authenticate("local")(req, res, () => {
          res.status(200).json({ _id: user._id, username: user.username });
        });
      }
    });
  }
  catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/logout", async (req, res) => {
  try {
    req.logout();
    res.status(200).json("You are logged out");
  }
  catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/getuser", async (req,res)=>{
  try{
    const user = await User.findOne(req.body); //"_id":"644ec8706ac7d2fbc502298d"
    res.status("200").json(user);
  }catch(err){
    res.status(500).json(err.message);
  }
})

module.exports = router;