
const mongoose = require('mongoose');

const checkoutschema = mongoose.Schema({
    products:{
        type:String,
        required:true
    },

    price: {
        type:String,
        required:true},
    
    qty:{
        type:String,
        required:true},
    
    userId:{
        type: String,
        required:true
    },
    username:{
        type:String,
        required:true
    }
});


module.exports = mongoose.model('checkoutmodels',checkoutschema);