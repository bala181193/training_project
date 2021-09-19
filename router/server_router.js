const express=require('express');
const router=express.Router();
const Login=require('../model/login_model');
const Product=require('../model/product_model');
const Cart_details=require('../model/weightmodel')
const User=require('../model/login_model');
const Product_cart_details=require('../model/cart_details')
const jwt=require('jsonwebtoken');
const multer=require('multer');
const { route } = require('../../React Admin/router/user_router');
const { token } = require('morgan');
const { json } = require('body-parser');
const { db } = require('../model/login_model');
const fs = require("fs");
const csv = require('csv-parser');
xlsxj = require("xlsx-to-json");
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";
const excelToJson = require('convert-excel-to-json');
const ImportCSV=require('../model/import_csv');
global.__basedir=__dirname
router.post('/register',(req,res)=>{
    console.log("register",req.body);
    const data=new Login({
        Name:req.body.Name,
        Email:req.body.Email,
        password:req.body.password,
        City:req.body.City,
        type:req.body.type
    }).save((err,doc)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("inserted",doc);
        }
    })
})
router.post('/login',(req,res)=>{
    console.log(req.body);
const email=req.body.Email;
const password=req.body.password;

    Login.findOne({"Email":req.body.Email},(err,doc)=>{
        console.log(doc);
        if(err){
            console.log("login_err",err)
        }
       else if(doc==null){
           console.log("err");
           res.json({message:"email is invalid",res_type:"error"})
       }
       else if(doc.password!=password){
           res.json({message:"invalid password",res_type:"error"})
       }
       else{
           console.log(doc._id)
         //  res.json({message:"login success"});
           const usertoken=jwt.sign({_id:doc._id},'secret');
           res.header('auth',usertoken).json({usertoken,res_type:doc.type});
           console.log(usertoken)
       }
    
    })
})

 const validUser=(req,res,next)=>{
var token=req.header('auth');
req.token=token;
    next();
}
router.get('/login',validUser,(req,res)=>{
   
    console.log(req.token);
jwt.verify(req.token,'secret',(err,data)=>{
Login.findOne({"_id":data._id},(err,doc)=>{
        if(err){
            console.log("login findone_err")
        }
        else{

            console.log("get data",doc)
            res.json(doc)
        }
    })

})
    
})
var profileImage=[];
var storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./public/uploads');
    },
    filename:(req,file,callback)=>{
var name='';
var ext='';
if(file.originalname){
    var p =file.originalname.lastIndexOf('.');
    ext=file.originalname.substring(p+1);
    var firstname=file.originalname.substring(0,p+1);
    name=Date.now()+'_'+firstname;
    name+=ext; 
  }
 profileImage=[];
profileImage.push({'name':name});
callback(null,name)

    }

})
var upload=multer({storage:storage,limits:{filesize:10}}).array('image');

router.post('/productadd',validUser,upload,(req,res)=>{
  //  console.log("token",req.token)
  //  console.log("product_add",req.body)
        jwt.verify(req.token,'secret',(err,user)=>{
            console.log(user)
            if(err){
                console.log("hi");
                res.sendStatus(400);
            }
            else{
            //    console.log(profileImage[0])
            //    console.log(req.files);
            //     console.log("token ok");
                const data=new Product({
                    product_name:req.body.product_name,
                    price:req.body.price,
                   image:profileImage[0].name,
                   user_id:user._id

                }).save((err,doc)=>{
                    if(err){
                        console.log('insert err',err)
                    }
                    else{
                        console.log("inserted",doc)
                       // res.json({message:'inserted'});
                     //  console.log(user._id)
                 
                    }
                })
               


            }
        })
    
})
router.get('/product_list',validUser,(req,res)=>{
   //console.log("token",req.token);
    jwt.verify(req.token,'secret',(err,doc)=>{
        if(err){
            console.log("list_err",err)
        }
        else{
            var id=doc._id
            console.log(id);
            Product.find({})
            .populate('user_id')
          .exec((err,product)=>{
            if(err){
                console.log("findone one list err")
            }
            else{
                res.json(product)
            }
          })
          
        }
    })
})


router.post('/product_cart_details',validUser,upload,(req,res)=>{

    //    console.log("token",req.token);
    //    console.log(req.body)
    jwt.verify(req.token,'secret',(err,result)=>{
        console.log(result._id)

        if(err){
            console.log("cart_details token err")
        }
        else{
             let data=req.body;
            
             console.log(data)
            let dataArray=[];
            data.forEach(item => {
                console.log(item.weight)
                dataArray.push({
                    price:parseFloat(item.price),
                    weight:parseFloat(item.weight),
                    product_id:item.product_id,
                    user_id:result._id
                    
                })
            });
            console.log("data array",dataArray)
            Product_cart_details.insertMany(dataArray,(err,result)=>{
                if(err){
                    console.log("cart save err",err)
                }
                else{

console.log("result",result)              
  }
            })

//                 let data=req.body;
//                 var dataLength=req.body.length;
//                 //console.log(dataLength)
//                 var count=0;
//                 var bulk = Product_cart_details.collection.initializeUnorderedBulkOp();
//                 data.forEach(item => {
//                     count++
//   console.log({"user_id":item.user_id},item.product_id)
//     Product_cart_details.findOne({"product_id":item.product_id,"user_id":item.user_id},(err,doc)=>{
// console.log("product",doc);
// if(doc==null){
//     bulk.insert({
//             weight:parseFloat(item.weight),
//             product_id:item.product_id,
//             user_id:item.user_id
//                 })
              
// }
// else{
//     bulk.find( { "product_id":item.product_id  } ).update( { $set: { weight: item.weight } } )
   
// }    
//          })
//          console.log(count,dataLength)
//                if(count==dataLength){
//             bulk.execute((err,data)=>{
//                 console.log(err,"errs")
//                 console.log("data",data);
//                       })
//                }
//             })

        }
    })

})


router.get('/product_cart_details',validUser,(req,res)=>{
console.log("token",req.token)
jwt.verify(req.token,'secret',(err,doc)=>{
    Product_cart_details.find({})
.populate("product_id")
.exec((err,doc)=>{
    console.log(doc)
    res.json(doc)
})
})
})

router.get('/product_cart_list',(req,res)=>{
Product.find({},(err,data)=>{
if(err){
    console.log(err)
}
else{
    const values=data;

    var arr = {data:[]}; 
    var obj=[]
    for(var i=0; i<values.length; i++) {
        arr.data.push(values[i]);
    }
    // for(var i=0; i<values.length; i++) {
    //     arr.data.push([values[i].product_name,values[i].price]);
    // }
    res.send(arr)
}
})
})
////search////
router.post('/product_cart_list1',(req,res)=>{
//console.log(req.body,"requestedvalue");
    var searchStr = req.body.search.value;
    if(searchStr)
    {
            var regex = new RegExp(req.body.search.value, "i")

            searchStr = { $or: [ {'product_name': regex},
            {'price': regex }] };
          
    }
    else
    {
         searchStr={};
    }
  console.log(req.body.order[0].dir)
  //  console.log(searchStr,"search1")

    var recordsTotal = 0;
    var recordsFiltered=0;
    
    Product.count({}, function(err, c) {
        recordsTotal=c;
        console.log(c,"count");
        Product.count(searchStr, function(err, c) {
            recordsFiltered=c;
            console.log(c);
            console.log("start",req.body.start);
            console.log("length",req.body.length);
          
            Product.find(searchStr, '_id product_name price user_id', 
            {'skip': Number( req.body.start), 'limit': Number(req.body.length),
        },
            function (err, results) {
                    if (err) {
                        console.log('error while getting results'+err);
                        return;
                    }
                    console.log(req.body.draw)
                    var data = JSON.stringify({
                        "draw": req.body.draw,
                        "recordsFiltered": recordsFiltered,
                        "recordsTotal": recordsTotal,
                        "data": results
                    });
                    res.send(data);
                })
        
          });
   });
   

})
// const storage1 = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, __basedir + '/uploads/')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
//     }
// });
 
const upload1 = multer({storage: storage});

router.post('/import_csv',upload1.single("uploadfile"),(req,res)=>{
    console.log(req.file.filename)
    fs.createReadStream('./public/uploads/' + req.file.filename)
.pipe(csv())
.on('data', function(data){
    try {
       console.log(data)
ImportCSV.insertMany(data,(err,doc)=>{
    if(err){
console.log(err,"err")    }
    else{

console.log(doc,"doc")    }
})
       
    }
    catch(err) {
        //error handler
    }
})
.on('end',function(){
    //some final operation
});  
})



router.post('/import_excel', upload1.single("uploadfile"),(req,res)=>{
    importExcelData2MongoDB( './public/uploads/' + req.file.filename);
    res.json({
        'msg': 'File uploaded/import successfully!', 'file': req.file
    });
   
})

function importExcelData2MongoDB(filePath){
    // -> Read Excel File to Json Data
    console.log('file path',filePath)
    xlsxj({
        input: filePath, 
        output: "output.json"
      }, function(err, result) {
        if(err) {
          console.error(err);
        }else {
          ImportCSV.insertMany(result,(err,doc)=>{
            if(err){
        console.log(err,"err")    }
            else{
        
        console.log(doc,"doc")    }
        })
        }
      });
    // const excelData = excelToJson({
    //     sourceFile: filePath,
    //     // sheets:[{
    //     //     // Excel Sheet Name
    //     //     name: 'Product',
 
    //     //     // Header Row -> be skipped and will not be present at our result object.
    //     //     header:{
    //     //        rows: 1
    //     //     },
      
    //     //     // Mapping columns to keys
    //     //     columnToKey: {
    //     //         A: '_id',
    //     //         B: 'product_name',
    //     //         C: 'price',
    //     //         D: 'user_id'
    //     //     }
    //     // }]
    // });
 
    // -> Log Excel Data to Console
 
 
    // MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    //     if (err) throw err;
    //     let dbo = db.db("ProductDB");
    //     dbo.collection("import_csv").insertMany(excelData.example, (err, res) => {
    //         if (err) throw err;
    //         console.log("Number of documents inserted: " + res.insertedCount);
    //         /**
    //             Number of documents inserted: 5
    //         */
    //         db.close();
    //     });
    // });
      
    fs.unlinkSync(filePath);
}
module.exports=router;
