const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { re } = require("semver");
const router = express.Router();
const Post = require('../models/postmodels');
const seller = require("../models/sellermodels");
const order = require("../models/ordersmodel")
const mong = require('mongoose');
//get details of seller
router.get('/:Seller_name',async (req,res) =>{
    try{
        const P = await Post.find({Seller_name:req.params.Seller_name});
        console.log(P)
        res.json(P);
    }
    catch(err){
        res.json({message:err})
    }
    
});
//add seller
router.post('/addseller',(req,res)=>{
    console.log("new request comming")
    const s = new seller({
        Seller_name: req.body.Seller_name,
        location: req.body.location,
        
    });

    s.save().then(data =>{
        res.json(data);
    }).catch(err => {
        res.json({message: err});
    });
});

//add prods by seller

//Get all prods
router.get('/',async (req,res)=>{
    try{
        const p = await Post.find();
        res.json(p);
    }
    catch(err){
        res.json({message:err});
    }

});
//add prod
router.post('/selleraddprod/:Seller_name',(req,res)=>{
    res.send("We are on posts");

    const P = new Post({
        product_name: req.body.product_name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        Seller_name: req.params.Seller_name,
        qty: req.body.qty
    });

    P.save().then(data =>{
        res.json(data);
    }).catch(err => {
        res.json({message: err});
    });
});
//get a specific post
router.get('/:postId',async (req,res)=>{
    try{
        const p = await Post.findById(req.params.postId);
        res.json(p);
    }
    catch(err){
        res.json({message:err});
    }

});
// get all prods with same name
router.get('/:product_name',async (req,res)=>{
    try{
        const p = await Post.find({product_name:req.params.product_name});
        res.json(p);
    }
    catch(err){
        res.json({message:err});
    }

});

//delete a specific post
router.delete('/:postId',async (req,res)=>{
    try{
        const p = await Post.remove({_id: req.params.postId});
        res.json(p);
    }
    catch(err){
        res.json({message:err});
    }

});
//update a specific post
router.patch('/:postId',async (req,res)=>{
    try{
        const p = await Post.updateOne({_id:req.params.postId},
            {$set:{qty:req.body.qty}});
        p.save().then(data =>{
            res.json(data);
        }).catch(err=>{
            res.json({message:err});
        });

    }
    catch(err){
        res.json({message:err});
    }

});


// post an order
router.post("/placeorder",async (req,res) =>{
    const o = new order({
        Seller_name:req.body.Seller_name,
        Seller_id: req.body.Seller_id,
        prod_id:req.body.prod_id,
        product_name:req.body.product_name,
        price:req.body.price,
        address:req.body.address,
        qty:req.body.qty,
        payment_mode:req.body.payment_mode
    });
    
    const t = await Post.find({_id:req.body.prod_id});
    console.log(t);
    console.log(typeof t);
    var giv_qty= req.body.qty;
    var old_qty = t[0]["qty"];
    prod_id = req.body.prod_id;
    console.log(old_qty);
    console.log(req.body.qty);
    let s=0;
    str =(parseInt(old_qty)-parseInt(req.body.qty))+'';
    console.log(str);
    try{
    if(parseInt(str)>=0){
        const p = await Post.updateOne({_id:prod_id},
            {$set:{qty:str}});
        p.save().then(data =>{
            res.json(data);
            
        }).catch(err => {
            res.json({message: err});
        });
        o.save().then(data =>{
            res.json(data);
            res.send("Order placed");
        }).catch(err => {
            res.json({message: err});
        });
    }
}
    catch(err){
        res.json({message:err});
    }



    




});

module.exports = router;