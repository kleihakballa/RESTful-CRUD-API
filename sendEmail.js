require('dotenv').config();
const axios = require('axios');
const sgMail = require('@sendgrid/mail')


const message ={
    to:'kleihakballa10@gmail.com',
    from:'klei.hakballa@gmail.com',
    subject:'Hello world',
    text:'hello world',
    html:'hello world'
}

// Example usage
sgMail
    .send(message)
    .then(res => console.log('Email sent...'))
    .catch(error => console.log(error.message));
