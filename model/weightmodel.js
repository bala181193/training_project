const mongooge=require('mongoose');

cart_details=mongooge.Schema({
    weight:{
        type:Number
    },
    product_id:{type:mongooge.Schema.Types.ObjectId,ref:'product_entries'},
    user_id:{type:mongooge.Schema.Types.ObjectId,ref:'userdetails '}
})
module.exports=mongooge.model('cart_details',cart_details)