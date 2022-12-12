const express=require('express')
const jwt = require('jwt-simple');
const app=express()
const cors=require('cors')
const route=require("./route");
//const eurekaHelper = require('./eurekaHelper');
const config = require('./config');
const listner = require('./KafkaListner');



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
        
        console.log(decoded);
        req.user={
            id:decoded.payload,
            isSeller:decoded.isSeller,
            email:decoded.sub
        }        
        }
    next();
}
//==================================APPLY-MIDDLEWARE==============================================

app.use(jwtDecode)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

//==================================LISTEN-KAFAKA-EVENTS==============================================

listner.kafkaSubscribe(config.kafka.topics.orderFulfillment);

//==================================DEFINE-ROUTES==============================================

app.use("/", route)

//==================================SERVER-START===============================================
let port = config.server.port;

app.listen(port,async()=>{
    console.log(`APP IS RUNNING AT ${port}`)    
})

