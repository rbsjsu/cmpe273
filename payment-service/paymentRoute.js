
require('dotenv').config()

const Payment = require("./model/payment");
const formidable=require('formidable')
const express=require('express')
const router=express.Router()

const https=require('https')

const PaytmChecksum=require('./PaytmChecksum')
const kafkaPublisher = require('./KafkaPublisher')
const config = require('./config').kafka;

//=========================================TEST-END-POINTS====================================================== */
router.get('/',(req,res)=>{
    console.log("helloget");
    res.send("hello");
})
router.post('/',(req,res)=>{
   // kafkaPublisher.publish(config.topicName,req.body,req,res);
   res.send(req.body);
})

//=========================================PAYMENT-CALLBACK====================================================== */
router.post('/callback',(req,res)=>
{

        const form=new formidable.IncomingForm();

        form.parse(req,(err,fields,file)=>
        {

        paytmChecksum = fields.CHECKSUMHASH;
        delete fields.CHECKSUMHASH;

        var isVerifySignature = PaytmChecksum.verifySignature(fields, process.env.PAYTM_MERCHANT_KEY, paytmChecksum);
        if (isVerifySignature) {

            var paytmParams = {};
           
            paytmParams.body = {
                "mid" : fields.MID,   
                "orderId" : fields.ORDERID
            };
            
            /*
            * Generate checksum by parameters we have
            * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
            */
            PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY).then(function(checksum){
            
                paytmParams.head = {
                    "signature"	: checksum
                };
               
                
            
                var post_data = JSON.stringify(paytmParams);
            
                var options = {
            
                    /* for Staging */
                    hostname: 'securegw-stage.paytm.in',
            
                    /* for Production */
                    // hostname: 'securegw.paytm.in',
            
                    port: 443,
                    path: '/v3/order/status',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };
            
                var response = "";
                var post_req = https.request(options, function(post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });
            
                    post_res.on('end', function(){
                                let data=JSON.parse(response)
                             
                               let result = data.body;
                               console.log(result);
                                if(result.resultInfo.resultStatus==='TXN_SUCCESS')
                                {
                                    let coll = req.app.coll;
                                    let data = {
                                        "orderId":result.orderId,
                                        "txnId":result.txnId
                                    }
                                    let msg={
                                        "eventType":"PAYMENT",
                                        "orderId":result.orderId,
                                        "bankTxnId":result.bankTxnId,
                                        "bankName":result.bankName,
                                        "paymentMode":result.paymentMode,
                                        "txnDate":result.txnDate,
                                        "cardScheme":result.cardScheme,
                                        "txnStatus":result.resultInfo.resultStatus
                                    }
                                    // kafkaPublisher.publish(config.topics.orderFulfillment,msg);
                                  
                                    //make a call to order service for generating the invoice 
                                    //console.log(result);
                                    //insert the information of transaction id and order id
                              const paymentRecord = new Payment(data);
                              paymentRecord.save().then(()=>console.log("Successfully saved the Payment Info !!1"))
                                .catch(()=>console.log("Unable to save the Transaction!!!"));
                                    // db.collection('payments').doc('mPDd5z0pNiInbSIIotfj').update({paymentHistory:firebase.firestore.FieldValue.arrayUnion(result)})
                                    // .then(()=>console.log("Update success"))
                                    // .catch(()=>console.log("Unable to update"))
                                }else if(result.resultInfo.resultStatus==='TXN_FAILURE'){
                                    let msg={
                                        "eventType":"canceled",
                                        "receiptId":result.orderId,
                                        "status":result.status
                                    }

                                  
                                    // kafkaPublisher.publish("OrderStream",msg);
                                }

                                res.redirect(`http://localhost:3000/status/${result.orderId}`)
                               


                    });
                });
            
                post_req.write(post_data);
                post_req.end();
            });        
                    

        } else {
            console.log("Checksum Mismatched");
            }
        })

});

//=========================================PAYMENT-INITIATE====================================================== */
router.post('/payment',(req,res)=>
{


const amount =req.body.totalBill;
const receiptId = req.body.receiptId;
const email = req.body.emailId;
const mobileNo=req.body.mobileNo;
const userId = req.body.userId;
	
    /* import checksum generation utility */
const totalAmount=amount;
var params = {};

/* initialize an array */
params['MID'] = process.env.PAYTM_MID,
params['WEBSITE'] = process.env.PAYTM_WEBSITE,
params['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID,
params['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE_ID,
params['ORDER_ID'] = receiptId,
params['CUST_ID'] = userId,
params['TXN_AMOUNT'] = totalAmount,
params['CALLBACK_URL'] = 'http://localhost:5000/callback',
params['EMAIL'] =email,
params['MOBILE_NO'] = mobileNo

/**
* Generate checksum by parameters we have
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
var paytmChecksum = PaytmChecksum.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);
paytmChecksum.then(function(checksum){
    let paytmParams={
        ...params,
        "CHECKSUMHASH":checksum
    }
    res.json(paytmParams)
}).catch(function(error){
	console.log(error);
});

})

//=========================================PAYMENT-STATUS====================================================== */
router.get('/status/:orderId',(req,res)=>{
   let id = req.params['orderId'];
  // console.log(id)
   if(id==null){
       res.status(400).send({"message":"please provide order id !!"});
   }else{

    var paytmParams = {};

    paytmParams.body = {
        "mid" : process.env.PAYTM_MID,   
        "orderId" : id,
    };
    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY).then(function(checksum){
        
        paytmParams.head = {
            "signature"	: checksum
        };
        var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: '/v3/order/status',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    // Set up the request
    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
           
            let data = JSON.parse(response).body;
            // console.log(data);
            if(data.resultInfo.resultCode=='334'){
                res.status(404).send({messsage:'Order not found, Please check the order id and try again !!!!'});
            }else{
                res.send(data);
            }
            
        });
    });

    // post the data
    post_req.write(post_data);
 });

    // let coll = req.app.coll;
    //    coll.find({ORDERID:id}).toArray().then(result=>{
    //     if(result.length==0){
    //         res.status(404).send({"message":"Order doesn't Exist"});
    //     }else{
    //      res.send(result[0]);
    //     }
    //    }).catch((err)=>{
    //     console.log(err);
    //     res.status(500).send({"message":"please try again after some time"});
    //    })

       
           
    }
 })

 //=========================================BANK-OFFERS====================================================== */
router.get('/offers/',(req,res)=>{
    var paytmParams = {};

        paytmParams.body = {
            "mid"  : process.env.PAYTM_MID
        };
        PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY).then(function(checksum){

            paytmParams.head = {      
                "channelId" : "WEB",
                "tokenType" : "CHECKSUM",
                "token"     : checksum
            };
            var post_data = JSON.stringify(paytmParams);

            var options = {
        
                /* for Staging */
                hostname: 'securegw-stage.paytm.in',
        
                /* for Production */
                // hostname: 'securegw.paytm.in',
        
                port: 443,
                path    : '/theia/api/v1/fetchAllPaymentOffers?mid='+process.env.PAYTM_MID,
                method  : 'POST',
                headers : {
                    'Content-Type'  : 'application/json',
                    'Content-Length': post_data.length
                }
            };
        
            var response = "";
            var post_req = https.request(options, function(post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });
        
                post_res.on('end', function(){
                    let result=JSON.parse(response)
                    res.send(result.body);
                });
               
            
        });
        post_req.write(post_data);
        post_req.end();
    });
  })

//=========================================SYNC-REFUND/INSTANT-REFUND============================================== */
router.post('/refund/',(req,res)=>{
   
      let receiptId=req.body.receiptId;
      let refundAmount = req.body.refundAmount;
     if(receiptId ==null || refundAmount==null){
         res.status(400).send({message:"Either receipt id or refund amount missing !!!!"});
     }else{
      
         Payment.findOne({'orderId':receiptId},(err,result)=>{
             if(err){
                 res.status(500).send({"message":err})
             }else{
               
                if(result.length==0){
                    res.status(404).send({message:"Order Not found !!!"});
                }else{
                    var paytmParams = {};
                    paytmParams.body = {
                        "mid"          : process.env.PAYTM_MID,
                        "txnType"      : "REFUND",
                        "orderId"      : result.orderId,
                        "txnId"        : result.txnId,
                        "refId"        : "REFUNDID_"+Date.now(),
                        "refundAmount" : JSON.stringify(refundAmount),
                        
                    };
                    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY).then(function(checksum){

                        paytmParams.head = {
                            "signature"  : checksum
                        };
                    
                        var post_data = JSON.stringify(paytmParams);
                    
                        var options = {
                    
                            /* for Staging */
                            hostname: 'securegw-stage.paytm.in',
                            
                            /* for Production */
                            // hostname: 'securegw.paytm.in',
                    
                            port: 443,
                            path: '/refund/api/v1/refund/apply/sync',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': post_data.length
                            }
                        };
                    
                        var response = "";
                        var post_req = https.request(options, function(post_res) {
                            post_res.on('data', function (chunk) {
                                response += chunk;
                            });
                    
                            post_res.on('end', function(){
                                
                               res.send(JSON.parse(response).body);
                            });
                        });
                        post_req.write(post_data);
                        
                     })
                    }   
               
                
             }
            
         });
                 
     }

 });
     


module.exports=router
