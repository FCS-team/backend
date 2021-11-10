const mongoose = require("mongoose")

const user_schema = mongoose.Schema({
    name : {
        type:String,
        require:true,
    },
    user_name : {
        type:String,
        required:true,
    },
    email: {
        type:String,
        require:true,
        min:6,
        max:30,
    },
    mobile: {
        type:String,
        require:true,
        max:10
    },
    dob: {
        type:String,
        require:true,
    },
    role: {
        type:String,
        require:true,
    },
    image: {
        type: String,
        require: true
    },
    token: {
        type:String,
    },
    address : {
        type: Object,
    }

})
const user_name = mongoose.Schema({
    email: {
        type: String,
        require: true
    }
})
const password = mongoose.Schema({
    key : {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true
    }
})
const user = mongoose.model('user', user_schema)
const userName = mongoose.model('user__name', user_name)
const secrets = mongoose.model('secrets', password) 

module.exports = { 
    user,
    userName,
    secrets
}