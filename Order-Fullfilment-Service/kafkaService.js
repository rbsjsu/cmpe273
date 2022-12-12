const invoiceUtil = require('./invoiceUtil')
const kafkaPublisher=require('./KafkaPublisher')
const fetch = require('node-fetch');
const { response } = require('express');
const config=require('./config')

exports.cancelOrderMail= async(data)=>{

    let orderInfo = await fetch('http://localhost:8083/secret/'+data.orderId).then(response=>{
        if(response.status==200){
            return response.json();
        }else{
          //throw exception here
            console.log("Error occuer while fetching the order info!!");
            return
        }
    });

    let productName = await fetch('http://localhost:3010/product?id='+orderInfo.productIdInteger).then(response=>{
        if(response.status==200){
            return response.json();
        }else{
          //throw exception here
            console.log("Error occuer while fetching the product info!!");
            return
        }
    })

    



       let userInfo = await fetch('http://localhost:8082/temp/'+orderInfo.userIdInteger).then(response=>{
        if(response.status==200){
            return response.json();
        }else{
           //throw exception
           console.log("user detail not found !!!!");
        }
    });


    let message;

    if(data.eventType==="OutOfStockRefund"){
       
        message = "Sorry to inform you that your Order of <b>"+ productName.title+"</b> has been canceled due to item is out of stock.";
    }else if(data.eventType==="ReturnedOrderRefund"){
        
        message = "Your returned request for the order of <b>"+ productName.title +"</b> has been approved.";
    }

    

    invoiceUtil.sendRefundInvoice(data,message,userInfo);
    //event genrated by the payment service
    
    //you will have refund id and order id send a mail to Customer
    //here send the cancelation mail and the refund intialted blah blah blah;
}

exports.initateRefund=async(data)=>{
    msg = {
        eventType:"OrderReturned",
        orderId:data.orderId
    }
    kafkaPublisher.publish(config.kafka.topics.payment,msg);

    let orderInfo = await fetch('http://localhost:8083/secret/'+data.orderId).then(response=>{
        if(response.status==200){
            return response.json();
        }else{
          //throw exception here
            console.log("Error occuer while fetching the order info!!");
            return
        }
    });

    let msg2={
        eventType:"returned",
        product:{
            productId:orderInfo.productIdInteger,
            quantity:orderInfo.quantityBoughtInteger
        }
    }
    kafkaPublisher.publish(config.kafka.topics.inventory,msg2);

   
}

exports.usePaymentInfo = async(paymentInfo)=>{
    //-----------------------------FETCH-ORDER-INFO-----------------------------------------
    let orderInfo = await fetch('http://localhost:8083/receipt/'+paymentInfo.orderId).then(response=>{
     if(response.status==200){
         return response.json();
     }else{
       //throw exception here
         console.log("Error occuer while fetching the order info!!");
         return
     }
 });
// console.log("orderInfo ")
// console.log(orderInfo)



//-------------------------------------FETCH-PRODUCT-NAME--------------------------------------------


for(let i of orderInfo.orderItems){
 let title  
  await fetch('http://localhost:3010/product?id='+i.productId).then(response=>{
     if(response.status==200){
         return response.json();
     }else{
       //throw exception here
         console.log("Error occuer while fetching the product info!!");
         return
     }
 }).then(data=>{title=data.title});
 //console.log(title);
 i.productName=title;
}


//  console.log(orderInfo)


 //-------------------------------------FETCH-USER-INFO--------------------------------------------

let userInfo;
//    let userInfo = await fetch('http://localhost:8082/temp/'+orderInfo.userId).then(response=>{
//         if(response.status==200){
//             return response.json();
//         }else{
//            //throw exception
//            console.log("user detail not found !!!!");
//         }
//     });

//     console.log("userInfo ");
//     console.log(userInfo)

//-------------------------------------FETCH-ADDRESS-INFO--------------------------------------------

let addressInfo = await fetch('http://localhost:8082/address/'+orderInfo.addressId).then(response=>{
     if(response.status==200){
         return response.json();
     }else{
        //throw exception
        console.log("user detail not found !!!!");
     }
 });

 // console.log("addressInfo ");
 // console.log(addressInfo)


 //-----------------------------------EXTRACT-USER-INFO------------------------------------------
 userInfo = addressInfo.user;

//----------------------------------Send-Email-based-on-Status------------------------------------------


// console.log(msg);
if(paymentInfo.eventType==="PAYMENT"){
 if(paymentInfo.txnStatus==="TXN_FAILURE"){
     invoiceUtil.sendCancellationInvoice(paymentInfo,orderInfo, userInfo, addressInfo);
     let msg={
         "receiptId":paymentInfo.orderId,
         "eventType":"canceled",
         "status":"CANCELED"
     }
     kafkaPublisher.publish(config.topics.order,msg)
 }else{
     
     invoiceUtil.sendInvoice(paymentInfo,orderInfo, userInfo, addressInfo);
     if(paymentInfo.txnStatus==="TXN_SUCCESS"){
         let msg={
             "receiptId":paymentInfo.orderId,
             "eventType":"confirmed",
             "status":"CONFIRMED"
         }
         kafkaPublisher.publish(config.topics.order,msg);

     }
 }
}

}