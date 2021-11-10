const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { re } = require("semver");
const router = express.Router();
const Post = require("../models/postmodels");
const seller = require("../models/sellermodels");
const order = require("../models/ordersmodel");
const mong = require("mongoose");
const msgbrd = require("messagebird");
const { Auth, LoginCredentials } = require("two-step-auth");
const user = require("../models/usersmodel");
const check = require("../models/usersmodel");
const cart = require("../models/cartmodel");
const ejs = require("ejs");
const { userName } = require("../models/credential");

// const stripe = require("stripe")(
// );

//get details of seller
router.get("/:Seller_name", async (req, res) => {
  try {
    const P = await Post.find({ Seller_name: req.params.Seller_name });
    res.json(P);
  } catch (err) {
    res.json({ message: err });
  }
});
//add seller

router.post("/addseller", (req, res) => {
  const s = new seller({
    Seller_name: req.body.Seller_name,
    location: req.body.location,
    phone: req.body.phone,
  });

  s.save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});
router.post("/adduser", async (req, res) => {
  const u = new user({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    wallet: req.body.wallet,
  });

  u.save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.patch("/updatewallet", async (req, res) => {
  try {
    const u = await user.updateOne(
      { _id: req.body.userId },
      { $set: { wallet: req.body.wallet } }
    );
    u.save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } catch (err) {
    res.json({ message: err });
  }
});
router.post("/sellerauth", async (req, res) => {
  // LoginCredentials.mailID = req.body.email;

  try {
    const r = await Auth(req.body.email, "ECOM FCS");

    res.send(r);
  } catch (err) {
    res.send(err);
  }
});
//verify otp
router.post('/verifyOTP',async (req,res)=>{
  if(OTP==req.body.OTP){
      res.json({message:"success otp verified"});
  }
  else{
      res.json({message:"verification unsuccessful"});
  }
})

//add prods by seller

//Get all prods
router.get("/", async (req, res) => {
  
  try {
    const p = await Post.find();
    res.json(p);
  } catch (err) {
    res.json({ message: err });
  }
});
//add prod
router.post("/selleraddprod/:Seller_name", (req, res) => {
  res.send("We are on posts");

  const P = new Post({
    product_name: req.body.product_name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    Seller_name: req.params.Seller_name,
    qty: req.body.qty,
  });

  P.save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});
//get a specific post
router.get("/:postId", async (req, res) => {
  try {
    const p = await Post.updateOne(req.params.postId);
    res.json(p);
  } catch (err) {
    res.json({ message: err });
  }
});
//get all prods with same category
router.get("/search/:category", async (req, res) => {
  try {
    const p = await Post.find({ category: req.params.category });
    res.json(p);
  } catch (err) {
    res.json({ message: err });
  }
});
// get all prods with same name
router.get("/:product_name", async (req, res) => {
  try {
    const p = await Post.find({ product_name: req.params.product_name });
    res.json(p);
  } catch (err) {
    res.json({ message: err });
  }
});

//delete a specific post
router.delete("/:postId", async (req, res) => {
  try {
    const p = await Post.remove({ _id: req.params.postId });
    res.json(p);
  } catch (err) {
    res.json({ message: err });
  }
});
//update a specific post
router.patch("/:postId", async (req, res) => {
  try {
    const p = await Post.updateOne(
      { _id: req.params.postId },
      { $set: { qty: req.body.qty } }
    );
    p.save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } catch (err) {
    res.json({ message: err });
  }
});

// post an order
router.post("/placeorder", async (req, res) => {
  const o = new order({
    Seller_name: req.body.Seller_name,
    Seller_id: req.body.Seller_id,
    prod_id: req.body.prod_id,
    product_name: req.body.product_name,
    price: req.body.price,
    address: req.body.address,
    qty: req.body.qty,
    payment_mode: req.body.payment_mode,
  });

  const t = await Post.find({ _id: req.body.prod_id });

  var giv_qty = req.body.qty;
  var old_qty = t[0]["qty"];
  prod_id = req.body.prod_id;
  let s = 0;
  str = parseInt(old_qty) - parseInt(req.body.qty) + "";
  try {
    if (parseInt(str) >= 0) {
      const p = await Post.updateOne({ _id: prod_id }, { $set: { qty: str } });
      p.save()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json({ message: err });
        });
      o.save()
        .then((data) => {
          res.json(data);
          res.send("Order placed");
        })
        .catch((err) => {
          res.json({ message: err });
        });
    }
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/payments", async (req, res) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: "Your Company Description",
      payment_method: id,
      confirm: true,
    });
    res.json({
      message: "Payment Successful",
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
});
//checkout
router.post("/checkout", async (req, res) => {
  const ch = new check({
    products: req.body.products,
    price: req.body.price,
    Seller_name: req.body.Seller_name,
    qty: req.body.qty,
    userId: req.body.userId,
  });
  ch.save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});
// router.post("/checkout", (req, res) => {
//     const ch = new check({
//         products: req.body.products,
//         price: req.body.price,
//         username: req.body.username,
//         qty: req.body.qty,
//         userId: req.body.userId
//     });
//     ch.save().then(data =>{
//         res.json(data);
//     }).catch(err => {
//         res.json({message: err});
//     });
// try {
//   stripe.customers
//     .create({
//       name: req.body.username,
//       email: req.body.email,
//       source: req.body.stripeToken
//     })
//     .then(customer =>
//       stripe.charges.create({
//         amount: parseInt(req.body.price),
//         currency: "inr",
//         customer: req.body.userId
//       })
//     )
//     .then(() => res.render("completed.html"))
//     .catch(err => console.log(err));
// } catch (err) {
//   res.send(err);
// }
//   });
// delete seller

router.delete("/deleteseller/:sellerId", async (req, res) => {
  try {
    const p = await seller.remove({ _id: req.params.sellerId });
    res.json(p);
  } catch (err) {
    res.json({ message: err });
  }
});

//add to cart


//update email
router.patch('/update/email',async (req,res) =>{
  try{
      const u = await user.updateOne({_id:req.body.userId},
          {$set:{email:req.body.email}});
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

//update address
router.patch('/update/address',async (req,res) =>{
  try{
      const u = await user.updateOne({_id:req.body.userId},
          {$set:{address:req.body.address}});
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
module.exports = router;
