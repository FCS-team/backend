const {user, userName, secrets} =  require('../models/credential');
const sellermodels = require('../models/sellermodels');
const router = require('express').Router()
router.get("/getall", async (req, res) => {
    try {
      const seller = await user.find({role:"seller"})
      const buyer = await user.find({role:"buyer"})
      const allUser = [...seller, ...buyer]
      const users = allUser.map((u, idx) => {
        if(u.role.toLowerCase()!=="admin")
        {
          return {user_name: u.user_name, name:u.name, role:u.role}
        }
  
      })
      res.json({
        users
      });
    } catch (err) {
      res.json({ message: err });
    }
  });

router.post("/delete", (req, res)=> {
    const user_name = req.body.user_name
    user.remove({user_name: user_name})
    userName.remove({_id:user_name})
    secrets.remove({link:user_name})
    res.send({message:"user deleted"})
})

router.post("/addseller", (req, res) => {
    const s = new sellermodels({
      Seller_name: req.body.Seller_name,
      location: req.body.location,
      phone: req.body.phone,
      email: req.body.email
    });
  
    s.save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  });
module.exports = router;