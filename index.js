const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
var bodyParser = require('body-parser');
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const passportLocalMongoose = require("passport-local-mongoose");
const path = require("path");
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const volRoute = require("./routes/volunteer");
const userSchema = require("./models/User");
const deleteImageRoute = require("./routes/deleteFile"); 
var cookies = require("cookie-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookies());
// app.use(bodyParser.json())

//setup passport
app.use(
  session({
    secret: "wasteTracker's_secretKey",
    resave: false,
    saveUnintialized: true,
    cookie: { secure: true }
  })
);
app.use(passport.initialize());
app.use(passport.session());

//MongoDB connection
mongoose.connect(
  `${process.env.MONGO_SERVER}`,
  // `mongodb://0.0.0.0:27017/WasteTracker`,
  // `mongodb://127.0.0.1/WasteTracker`
);

//after schemas
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

//after creating collection
passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});




app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/volunteer", volRoute);
app.use("/deleteImage", deleteImageRoute);

const PORT = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.send(`Backend running fine on port ${PORT}`);
});
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
