const router = require('express').Router()
const { user, userName, secrets } = require('../models/credential')
const {isAuth} = require("../middleware/isAuth")
router.post('/profile',async (req, res) => {
  const u = isAuth(req);
  
  if(u==false || !userName.findOne({_id:u.user_name})){
    return res.json({message:"User is not authenticated"});  
  }

    const oldemail =  req.body.email    
    const userDetails = await user.findOne({email: oldemail})
    if(!userDetails){
        return res.status(400).send({message: "Something went wrong"})
    }
    try{
        const address = req.body.address
        const newEmail = req.body.newemail
        await userName.updateOne({email:oldemail}, {$set:{"email": newEmail}})
        console.log(address)
        await user.updateOne({email:oldemail}, {$set:{"address":address}})
        await user.updateOne({email:oldemail}, {$set:{'mobile':req.body.mobile}})
        await user.updateOne({email:oldemail}, {$set:{'email':newEmail}})

        return res.send(await user.findOne({email:newEmail}))
    }catch(err){
        return res.send(err)
    }
})

module.exports = router
