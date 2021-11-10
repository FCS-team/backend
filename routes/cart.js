const router = require('express').Router()
const cart = require("../models/cartmodel")
const {userName} = require("../models/credential")

router.post("/addtocart", async (req, res) => {
    console.log(req.body.product)
    var userExist = await cart.findOne({userId: req.body.user_name})
    
    if(!userExist && await userName.findById({_id: req.body.user_name})){
      const c = new cart({
        products: [req.body.product],
        userId: req.body.user_name
      })
      await c.save()
      return res.send(c.products)
    }
    else if(userExist){
      var products = (await cart.findOne({userId: req.body.user_name})).products
      const prod = req.body.product
      const index = products.findIndex(
        (basketItem) => basketItem.id === prod.id)
      if(index>-1){
        let newProd = {...products[index], quantity: prod.quantity}
        if(newProd.quantity==0)
        {
            let newBasket = [...products];

            newBasket.splice(index,1)
            
            products = newBasket
        }
        else products[index] = newProd
      }
      else{
        products = [...products, prod]
      }
      await cart.updateOne({userId:req.body.user_name}, {$set:{'products':products}})
      return res.send(products)
    }
    // const c = new cart({
    //   userId: req.body.userId,
    // });
  });
  
  router.post("/getcart", async (req, res)=>{
    const userExist = await cart.findOne({userId:req.body.user_name})
    if(!userExist){
      return res.send([])
    }
    return res.send(userExist.products)
  })

module.exports = router