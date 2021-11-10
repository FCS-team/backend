const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { user, userName, secrets } = require('../models/credential')
const {createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken    } = require("../middleware/tokens");
const { isRefresh } = require('../middleware/isAuth');
const { send } = require('express/lib/response');
let refreshTokens=[];


function auth(req,res,next){
    let token = req.headers["authorization"];
    token = token.split(" ")[1];
    jwt.verify(token, "access", (err,u)=>{
        if(!err){
            req.u = u;
            next();
        }
        else{
            return res.json({message:"User not authenticated"});
        }
    })

}

router.post('/renewtoken',(req,res)=>{
    const refreshtoken = req.body.token;
    if(!refreshtoken || !refreshTokens.includes(refreshtoken)){
        res.json({message:"User not authenticated"});
    }
    jwt.verify(refreshtoken,"refresh",(err,u)=>{
        if(!err){
            const accesstoken = jwt.sign({name:u.name},"access",{expiresIn:"15m"});
            res.json({accesstoken});
        }
        else{
            return res.json({message:"User not authenticated"});
        }
    })
})


router.post('/protected', auth,(req,res)=>{
    res.send("Inside protected");
})

router.post('/register', async (req, res)=> {
    const userExist = await userName.findOne({email : req.body.email})
    if(userExist){
        return res.status(400).send("email already registered")
    }
    const user_name = new userName({
        email: req.body.email
    })
    const pass = new secrets({
        key: await bcrypt.hash(req.body.password, 10),
        link: user_name.id
    })
    const seed = Math.floor(Math.random()*5000)
    const created__user = new user({
      name : req.body.name,
      user_name : user_name.id,
      email: req.body.email,
      mobile: req.body.mobile,
      dob: req.body.dob,
      role: req.body.role,
      image: `https://avatars.dicebear.com/api/human/${seed}.svg `, 
      address : {
          flat: "",
          locality:"",
          state:"",
          pin:"",
          district:""
      }         
    })
    try{
        await created__user.save()
        await pass.save()
        await user_name.save()
        const accesstoken = createAccessToken(created__user)
        const refreshtoken = createRefreshToken(user_name.id)
        sendRefreshToken(res, refreshtoken)
        sendAccessToken(res, req, accesstoken)
        // res.status(200).send(created__user)
    }catch(err){
        console.log(err)
    }
})

router.post('/login', async (req, res) => {
    
    // const {u} = req.body;
    // if(!u){
    //     return res.status(404).json({message:"Empty body"});

    // }
    // let accesstoken = jwt.sign(req.body, "access", process.TOKEN_KEY,{expiresIn:"15m"});
    
    // let refreshtoken = jwt.sign(req.body, "refresh",{expiresIn:"7d"});
   
    // refreshTokens.push(refreshtoken);
    try{
        const {email, password} = req.body
        if(!email)
        {
            return res.header('Access-Control-Allow-Credentials', true).status(400).send({error:"no refresh token"})
        }
        const user_name = await userName.findOne({email: email})
        if(user_name==null)
        {
            return res.header('Access-Control-Allow-Credentials', true).status(200).send({error:"user does not exist"})
        }
        const pass = await secrets.findOne({link: user_name.id})
        if(await bcrypt.compare(password, pass.key)){
            // res.header("Access-Control-Allow-Origin", "*");

            const real__user = await user.findOne({user_name : user_name.id})
            const accesstoken = createAccessToken(real__user)
            const refreshtoken = createRefreshToken(user_name.id)
            //   real__user.token = accesstoken
            // return res.status(200).json({
            //     real__user,
            //     accesstoken,
            //     refreshtoken
            // })
            sendRefreshToken(res, refreshtoken)
            sendAccessToken(res, req, accesstoken)
        }
        return res.header('Access-Control-Allow-Credentials', true).send({error: "Password is incorrect"})
    }catch(err){

    }
    
})

router.post('/logout', (_req, res) => {
    res.clearCookie('refreshtoken', { path: '/refresh_token' });
    // Logic here for also remove refreshtoken from db
    return res.send({
      message: 'Logged out',
    });
  });

router.post("/refreshLogin", async(req, res) => {
    const token = req.cookies.refreshtoken
    if(token)
    {
        userId = isRefresh(token)
        const real_user = await user.findOne({user_name:userId})
        const accesstoken = createAccessToken(real_user)

        return sendAccessToken(res, req, accesstoken)
    }
    return res.status(400).send({error:"no refresh token"})
})
module.exports = router