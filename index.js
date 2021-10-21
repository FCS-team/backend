const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyPars = require('body-parser');
require("dotenv/config");


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
mongoose.connect(process.env.DB_CONN,(error)=>{
    if(!error){
        console.log("connection est");
    }
    else{
        console.log("error connecting to db")
    }
})

app.listen(3000);