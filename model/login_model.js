const mongoose=require('mongoose');

const loginmodel=mongoose.Schema({
Name:{
    type:String
},
    Email:{
        type:String
    },
    password:{
        type:String
    },
    City:{
        type:String
    },
    type:{
        type:String
    }
})

module.exports=mongoose.model('userdetails',loginmodel)