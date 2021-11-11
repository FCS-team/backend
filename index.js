const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyPars = require('body-parser');
const https = require('https')
const path = require('path');
const fs = require('fs');
require("dotenv/config");
const ejs= require('ejs');
const cors = require("cors");
const cookie = require('cookie-parser')
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(cookie())
app.use(bodyPars.urlencoded({
    extended:true
}
));
app.use( cors( {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials:true
  })
);

app.use(
  bodyPars.urlencoded({
    extended: true,
  })
);
app.use(bodyPars.json());
//Import routes

const postroute = require("./routes/posts");
const auth = require("./routes/auth");
const detailChange = require('./routes/detailChange')
const cartRoute = require("./routes/cart")
const userapi = require('./routes/userapi')
app.use("/posts", postroute);
app.use("/api/auth", auth);
app.use("/update", detailChange)
app.use('/user', userapi);
app.use("/cart", cartRoute)
app.get("/", (req, res) => {
  res.send("We are on home");
});


const ssl = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "private.pem")),
    cert: fs.readFileSync(path.join(__dirname, "ssl_cert.pem")),
  },
  app
);

mongoose.connect(process.env.DB_CONN,(error)=>{
    if(!error){
        console.log("connection est");
    }
    else{
        console.log("error connecting to db")
        console.log(error)
    }
})
ssl.listen(process.env.SSL_PORT,()=> console.log("ssl server live"));
app.listen(process.env.PORT);
