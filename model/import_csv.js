const mongoose=require('mongoose');

const importSchema=mongoose.Schema({
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

module.exports=mongoose.model('import_csv',importSchema)