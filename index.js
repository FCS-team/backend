const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')
const bodyPars = require('body-parser');
const https = require('https')
const path = require('path');
const fs = require('fs');
require("dotenv/config");
app.use(express.json())
app.use( cors( {
    origin: "http://localhost:3000",
    methods : ['GET', 'POST']
}))
console.log(process.env.DB_CONN)

app.use(bodyPars.urlencoded({
    extended:true
}
));
app.use(bodyPars.json());
//Import routes


const postroute = require("./routes/posts");
const auth = require("./routes/auth");


app.use('/posts',postroute);
app.use("/api/auth", auth)
app.get('/', (req,res)=>{
    res.send("We are on home");
})
const ssl = https.createServer({
    key: fs.readFileSync(path.join(__dirname,'cert','private.pem')),
    cert:fs.readFileSync(path.join(__dirname,'cert','ssl_cert.pem'))
},app)

mongoose.connect(process.env.DB_CONN,(error)=>{
    if(!error){
        console.log("connection est");
    }
    else{
        console.log("error connecting to db")
    }
})
ssl.listen(5500,()=> console.log("ssl server live"));
app.listen(5000);