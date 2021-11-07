const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyPars = require('body-parser');
const https = require('https')
const path = require('path');
const fs = require('fs');
require("dotenv/config");

const ejs= require('ejs');
const stripe = require('stripe')('sk_test_51JtAxPSJlwxKEMaQXiwO8ZbU40zWfnRz1ozByQBtxodkB1vfv36mN8pKwxh8atcRLuwNbyiCFahxmX26QZbLBVBr00DQtaeObl');

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyPars.urlencoded({
    extended:true
}
));
app.use(bodyPars.json());
//Import routes


const postroute = require("./routes/posts");


app.use('/posts',postroute);
app.get('/', (req,res)=>{
    res.send("We are on home");
})
const ssl = https.createServer({
    key: fs.readFileSync(path.join(__dirname,'private.pem')),
    cert:fs.readFileSync(path.join(__dirname,'ssl_cert.pem'))
},app)
mongoose.connect(process.env.DB_CONN,(error)=>{
    if(!error){
        console.log("connection est");
    }
    else{
        console.log("error connecting to db")
        console.log(error)
    }
})
ssl.listen(5500,()=> console.log("ssl server live"));
app.listen(3000);