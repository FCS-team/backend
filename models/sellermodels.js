const mongoose = require('mongoose');


const seller_schema = mongoose.Schema({
    Seller_name:{
        type:String,
        required:true},
    location:{
        type:String,
        required:true},


});

module.exports = mongoose.model('sellermodel',seller_schema);