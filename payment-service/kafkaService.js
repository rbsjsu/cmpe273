require('dotenv').config()

const fetch = require("node-fetch")
const Payment = require("./model/payment")
const kafkaPublisher =require("./KafkaPublisher")
const config = require("./config")
const PaytmChecksum=require('./PaytmChecksum')
const https=require('https')


exports.intiateRefund=async(data)=>{
    
    let orderInfo = await fetch('http://localhost:8083/secret/'+data.orderId).then(response=>{
        if(response.status==200){
            return response.json();
        }else{
          //throw exception here
            console.log("Error occuer while fetching the order info!!");
            return
        }
    });

 
    //console.log(orderInfo);

    let refundAmount = orderInfo.billAmountDouble*orderInfo.quantityBoughtInteger;
    let orderId = orderInfo.receiptIdString;
  let payment = await Payment.findOne({orderId:orderId});
  

            var paytmParams = {};
            paytmParams.body = {
                "mid": process.env.PAYTM_MID,
                "txnType": "REFUND",
                "orderId": payment.orderId,
                "txnId": payment.txnId,
                "refId": "REFUNDID_" + Date.now(),
                "refundAmount": JSON.stringify(refundAmount),

            };
            PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY).then(function (checksum) {

                paytmParams.head = {
                    "signature": checksum
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
                var post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });

                    post_res.on('end', function () {

                       let res = JSON.parse(response).body;

                       const {
                        acceptRefundStatus,
                        acceptRefundTimestamp,
                        refundDetailInfoList,
                        refId,
                        refundId,
                        refundAmount,
                        resultInfo
                       } = res

                       let msg = {
                           refundResponse:{
                            acceptRefundStatus,
                            acceptRefundTimestamp,
                            refundDetailInfoList,
                            refId,
                            refundId,
                            refundAmount,
                            resultInfo
                           },
                           orderId:data.orderId
                       }
                       
                       if(data.eventType==="OutOfStock"){
                            msg.eventType="OutOfStockRefund";
                       }else{
                           msg.eventType="ReturnedOrderRefund";
                       }
                       kafkaPublisher.publish(config.kafka.topics.orderFulfillment, msg)
                       console.log(msg.eventType + " event published....");
                    });
                });
                post_req.write(post_data);

            })

}