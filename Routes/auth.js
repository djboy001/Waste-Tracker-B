const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var cookies = require("cookie-parser");
const router = require("express").Router();

router.use(cookies());


// user model
const { User } = require('../models/User');

// authentication route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json('Invalid username or password');
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json('Invalid username or password');
        const token = jwt.sign({ username, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('authtoken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
        res.json({ username, _id: user._id });
    } catch (err) {
        console.log(err);
        res.status(500).json("An unknown error occurred");
    }
});

// register route
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json('Username already taken');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, password: hashedPassword, email });
    const { _id } = await user.save();
    res.json(_id);
});

// logout route
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json("You are logged out");
});

module.exports = router;