const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    product_name:{
        type:String,

    },
    price:{
        type:String
    },

    image:{
        type:String
    },

    user_id:{
        type:mongoose.Schema.Types.ObjectId,ref:'userdetails'
    },
   
    
})

module.exports=mongoose.model('product_entries',productSchema)