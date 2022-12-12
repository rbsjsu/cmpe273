const express=require('express')
const jwt = require('jwt-simple');
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
 const paymentRoute=require('./paymentRoute')
const mongoose = require("mongoose");
const eurekaHelper = require('./eurekaHelper');
const config = require('./config');


const KafkaListner = require('./KafkaListner');
//consumer.kafkaSubscribe(config.kafka.topicName);



//========================DATABASE-CLIENT===========================================================
// const MongoClient = require('mongodb').MongoClient;
// var client = new MongoClient(config.database.uri,{ useUnifiedTopology: true}); 



//========================JWT-DECODER===========================================================
var jwtDecode = (req,res,next)=>{
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
           // console.log(authorization)
        try {
            decoded = jwt.decode(authorization, config.jwtSecret, true);
        } catch (e) {
            return res.status(401).send(e.message);
        }
        
        req.user={
            id:decoded.payload,
            email:decoded.sub
        }        
        }
    next();
}


app.use(jwtDecode);
app.use(express.json())
app.use(cors())
app.use('/',paymentRoute);



let port = config.server.port;



eurekaHelper.registerWithEureka(config.application.name, config.server.port);
app.listen(port,async()=>
{
    console.log(`APP IS RUNNING AT ${port}`)
    mongoose.connect(config.database.uri,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
    
         },(err)=>{
        if(err)
        {console.log( err)}
        else{
            console.log("Databse Connected Sucessfully !!!");
        //    KafkaListner.kafkaSubscribe(config.kafka.topics.payment);
        }
    });
   
   
})

