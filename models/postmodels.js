const mongoose = require('mongoose');

const postschema = mongoose.Schema({
    product_name:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true},
    category: {
        type:String,
        required:true},
    price: {
        type:String,
        required:true},
    Seller_name: {
        type:String,
        required:true},
    qty:{
        type:String,
        required:true}
});





module.exports = mongoose.model('postmodels',postschema);

