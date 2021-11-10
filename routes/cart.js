const router = require('express').Router()
const cart = require("../models/cartmodel")
const { user, userName, secrets } = require("../models/credential")
const {isAuth} = require("../middleware/isAuth")
router.post("/updatecart", async (req, res) => {
  const u = isAuth(req);
  console.log(`products: ${req.body.products}`)
  if(u==false || !userName.findOne({_id:u.user_name})){
    return res.json({message:"User is not authenticated"});  
  }
  const userExist = userName.findOne({_id:u.user_name})
  if(userExist){
    const c = await cart.findOne({userId:u.user_name})
    if(c)
    {
      cart.updateOne({userId:u.user_name}, {$set:{"products":req.body.products}})
    }
    
  } 
  return res.status(200).send() 
});
  
  router.post("/getcart", async (req, res)=>{
    const u = isAuth(req);

    if(u==false || !userName.findOne({_id:u.user_name})){
      return res.json({message:"User is not authenticated"});  
    }
    const userExist = await cart.findOne({userId:u.user_name})
    if(!userExist){
      return res.send([])
    }
    return res.send(userExist.products)
  })

module.exports = router