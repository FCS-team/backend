const mongoose = require('mongoose');


const orders_schema = mongoose.Schema({
    Seller_name:{
        type:String,
        required:true},
    Seller_id:{
        type:String,
        required:true},
    prod_id : {
        type:String,
        required:true},
    prod_name:{
        type:String,
        required:true},
    price:{
        type:String,
        required:true},
    address:{
        type:String,
        required:true},
    qty:{
        type:String,
        required:true},
    payment_mode:{
        type:String,
        required:true}
})

module.exports = mongoose.model('ordersmodel',orders_schema)