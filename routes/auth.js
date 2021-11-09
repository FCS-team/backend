const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { user, userName, secrets } = require('../models/credential')

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
      image: `https://avatars.dicebear.com/api/human/${seed}.svg `,          
    })
    try{
        await created__user.save()
        await pass.save()
        await user_name.save()
        res.status(200).send(created__user)
    }catch(err){
        console.log(err)
    }
})

router.post('/login', async (req, res) => {
    // const {u} = req.body;
    // if(!u){
    //     return res.status(404).json({message:"Empty body"});

    // }
    let accesstoken = jwt.sign(req.body, "access",{expiresIn:"15m"});
    
    let refreshtoken = jwt.sign(req.body, "refresh",{expiresIn:"7d"});
   
    refreshTokens.push(refreshtoken);

    const email = req.body.email
    const password = req.body.password
    const user_name = await userName.findOne({email: email})
    if(user_name==null)
    {
        return res.status(200).send("user does not exist")
    }
    const pass = await secrets.findOne({link: user_name.id})
    if(await bcrypt.compare(password, pass.key)){
        res.header("Access-Control-Allow-Origin", "*");
        // const token = jwt.sign(
        //     { user_id: user._id, email },
        //     process.env.TOKEN_KEY,
        //     {
        //       expiresIn: "15m",
        //     }
        //   );
          const real__user = await user.findOne({user_name : user_name.id})
          real__user.token = accesstoken
        return res.status(200).json({
            real__user,
            accesstoken,
            refreshtoken
        })
    }
    return res.send("Password is incorrect")
})

router.patch('/update/name',async (req,res) =>{
    try{
        const u = await user.updateOne({_id:req.params.userId},
            {$set:{name:req.body.name}});
        u.save().then(data =>{
            res.json(data);
        }).catch(err=>{
            res.json({message:err});
        });

    }
    catch(err){
        res.json({message:err});
    }
})

router.patch('/update/username',async (req,res) =>{
    try{
        const u = await user.updateOne({_id:req.params.userId},
            {$set:{user_name:req.body.user_name}});
        u.save().then(data =>{
            res.json(data);
        }).catch(err=>{
            res.json({message:err});
        });

    }
    catch(err){
        res.json({message:err});
    }
})

router.patch('/update/phone',async (req,res) =>{
    try{
        const u = await user.updateOne({_id:req.params.userId},
            {$set:{mobile:req.body.mobile}});
        u.save().then(data =>{
            res.json(data);
        }).catch(err=>{
            res.json({message:err});
        });

    }
    catch(err){
        res.json({message:err});
    }
})


module.exports = router