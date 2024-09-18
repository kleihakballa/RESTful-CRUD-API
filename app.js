const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const app = express();
const nodemailer = require('nodemailer');
const passport = require('passport');
app.use(express.urlencoded());
app.use(express.json());
app.use(bodyParser.json());
const routes = require('./routes');

const cors = require('cors');
app.use(cors());


const connectDB = require('./config/db');
dotenv.config({path:'./config/config.env'});



connectDB();

app.use(passport.initialize());

app.use('/api', routes);


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
        to: email,
        from:   process.env.EMAIL_USER,
        subject: `Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ success: false, error: 'Failed to send email' });
        }
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    });
});



app.listen(5000);
