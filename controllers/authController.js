const User = require('../model/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Token = require('../model/Tokens');
const nodemailer = require("nodemailer");
const crypto = require ('crypto');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "kleihakballa12@gmail.com",
        pass: "cmtpwathmeogdrwu",
    },
});

const sendVerificationToken = async (req, res) => {
        function generateToken(){
            return crypto.randomInt(100000, 999999).toString();
        }
        const token = generateToken();
        const {email} = req.body;
        const newToken = new Token({
            email,
            token
        })


        await newToken.save();
        const mailOptions = {
            to: email,
            from:   process.env.EMAIL_USER,
            subject: `Verification to library`,
            text: `New verification token is ${token}`,
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ success: false, error: 'Failed to send email' });
            }
            res.status(200).json({ success: true, message: 'Email sent successfully' });
        });






};

const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, token } = req.body;

    try {
        const tokenDoc = await Token.findOne({ email, token });
        if (!tokenDoc) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ msg: 'User registered successfully', user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


const loginMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) return next();
            return res.status(400).json({ message: 'You are already logged in.' });
        });
    } else {
        next();
    }

}
// Login
const login = async (req, res, next) => {
    const { email, password } = req.body;


    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success:false, error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({success:false, error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
            expiresIn:'1h',
        });

        res.json({success:true, token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { signup, login, loginMiddleware , sendVerificationToken};
