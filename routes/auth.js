const router = require('express').Router()
const bcrypt = require('bcrypt')
const { user, userName, secrets } = require('../models/credential')


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
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "15m",
            }
          );
          const real__user = await user.findOne({user_name : user_name.id})
          real__user.token = token
        return res.status(200).send(real__user)
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