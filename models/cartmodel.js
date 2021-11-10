const mongoose = require('mongoose');


const cartschema = mongoose.Schema({
    products:{
        type:Array
    },
    userId:{
        type:String,
        required:true
    }

})


module.exports = mongoose.model('cartmodel',cartschema);
