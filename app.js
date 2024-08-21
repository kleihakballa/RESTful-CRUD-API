const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(bodyParser.json());


/*app.get("/",(req,res)=>{
    res.send("hello world");
})

app.get("/students",(req,res)=>{
    res.send("students");
})*/
const connectDB = require('./config/db');
dotenv.config({path:'./config/config.env'});

connectDB();

app.use('/', require('./routes/index'));


app.listen(5000);