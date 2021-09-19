const mongoose=require('mongoose');

let product_cart_details=mongoose.Schema({

    

    weight:{
        type:Number
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,ref:'product_entries'
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,ref:'userdetails'
    },
  
})
module.exports=mongoose.model('product_car_details',product_cart_details);