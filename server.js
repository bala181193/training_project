const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');
const morgan=require('morgan')
const router=require('./router/server_router')
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.json());
app.use(cors());
app.use(morgan('dev'))
mongoose.connect('mongodb://localhost:27017/ProductDB',{useNewUrlParser:true});

var db=mongoose.connection;
db.on('error',console.log.bind(console,'connection err'));
db.once('open',(callback)=>{
    console.log('db connected');
})

app.use('/',router);
app.listen('4000',(req,res)=>{
    console.log('4000 server is running');
})

