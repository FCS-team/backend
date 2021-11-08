const mongoose = require('mongoose');


const cartschema = mongoose.Schema({
    prodname:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    qty:{

    
    type:String,
    required:true
    },

    userId:{
        type:String,
        required:true
    }

})


module.exports = mongoose.model('cartmodel',cartschema);
