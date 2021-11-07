const { json } = require('express/lib/response');
const mongoose = require('mongoose');

const user_schema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true},
    email: {
        type:String,
        required:true},
    address: {
        type:String,
        required:true},
    wallet:{
        type:String,
        required:true},


});

module.exports = mongoose.model('usersmodel',user_schema);

