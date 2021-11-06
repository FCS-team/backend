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
        return res.status(200).send(await user.findOne({user_name : user_name.id}))
    }
    return res.send("Password is incorrect")
})
module.exports = router