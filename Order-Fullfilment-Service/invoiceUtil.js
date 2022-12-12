const kafkaPublisher=require('./KafkaPublisher')
const config = require("./config")
module.exports.sendInvoice=async(paymentInfo,orderInfo,userInfo,addressInfo)=>{
    var paymentStatus;
    var summery=``;
    var total=0.0;
    var taxes=0.0;
    if(paymentInfo.txnStatus==="TXN_SUCCESS"){
        paymentStatus='<b style="color:green">SUCCEED</b>'
    }else if(paymentInfo.txnStatus==='TXN_FAILURE'){
        paymentStatus='<b style="color:red">FAILED</b>'
    }else{
        paymentStatus='<b style="color:goldenrod">PENDING</b>'
    }

    
    let n = orderInfo.orderItems.length;
    let productInfo = orderInfo.orderItems;
   
   

  for(let i=0; i<n; i++){
        let subtotal = productInfo[i].quantity*productInfo[i].price;

    let temp = `<tr class="item">
    <td>${productInfo[i].productName}</td>
    <td style="text-align: right;">${productInfo[i].quantity}</td>
    <td style="text-align: right;">Rs. ${productInfo[i].price}</td>
    <td style="text-align: right;">Rs. ${subtotal}</td>
    </tr>`;

        summery+=temp;
        total+=subtotal
       
    }
   
    taxes = total*0.05;
    total+=taxes;
    
    let template=`<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>A simple, clean, and responsive HTML invoice template</title>
    
            <style>
                
                .invoice-box {
                    max-width: 800px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #eee;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                    font-size: 16px;
                    line-height: 24px;
                    font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                    color: #555;
                }
    
                .invoice-box table {
                    width: 100%;
                    line-height: inherit;
                    text-align: left;
                }
    
                .invoice-box table td {
                    padding: 5px;
                    vertical-align: top;
                }
    
                .invoice-box table tr td:nth-child(2) {
                    text-align: right;
                }
    
                .invoice-box table tr.top table td {
                    padding-bottom: 20px;
                }
    
                .invoice-box table tr.top table td.title {
                    font-size: 45px;
                    line-height: 45px;
                    color: #333;
                }
    
                .invoice-box table tr.information table td {
                    padding-bottom: 30px;
                }
                .invoice-box table tr.information table td:nth-child(2) {
                    text-align: right;
                }
                .invoice-box table tr.heading td {
                    background: #eee;
                    border-bottom: 1px solid #ddd;
                    font-weight: bold;
                }
    
                .invoice-box table tr.details td {
                    padding-bottom: 20px;
                }
    
                .paymentInfo td{
                    padding: 0px;
                    border-bottom: 2px #eee solid;
                    font-size:13px;
                }
                .invoice-box table tr.item td {
                    border-bottom: 1px solid #eee;
                    font-size: 13px;
                    
                }

                .item{font-size:13px}
    
                
                .invoice-box table tr.item.last td {
                    border-bottom: none;
                }
    
                .invoice-box table tr.total table{
                    
                    font-weight: bold;
                    text-align: right;
                    font-size:14px;
                }
                .invoice-box table tr.total table tr td:nth-child(2){
                    border-bottom: 2px #eee solid;
                }
    
                b{
                    font-size: 14px;
                }
                @media only screen and (max-width: 600px) {
                    .invoice-box table tr.top table td {
                        width: 100%;
                        display: block;
                        text-align: center;
                    }
    
                    .invoice-box table tr.information table td {
                        width: 100%;
                        display: block;
                        text-align: center;
                    }
                }
                @media print {
      body * {
        visibility: hidden;
        font-size: 17px;
      }
      .printable, .printable * {
        visibility: visible;
        font-size:13px ;
      }
      .printable {
          margin:0px;
          padding: 0px;
        position: absolute;
        left: 0;
        top: 0;
       
      }
      .btn{
          visibility: hidden;
      }
    }
    
                /** RTL **/
                .rtl {
                    direction: rtl;
                    font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                }
    
                .rtl table {
                    text-align: right;
                }
    
                .rtl table tr td:nth-child(2) {
                    text-align: left;
                }
            </style>
        </head>
    
        <body style="background-color: #eee; padding:20px">
            <div class="invoice-box " style="background-color: #fff; width: 60vw;">
                <div class="printable">
                <table cellpadding="0" cellspacing="0">
                    
                    <tr class="top" >
                        <td colspan="4" style="border-bottom: 2px #eee solid;">
                            <table style="margin: 0px;">
                                <tr>
                                    <td class="title" style="padding: 0px;">
                                        <img src="https://drive.google.com/uc?export=view&id=1ff-kRSSaHkoHEg0mVjzSjC-I4zLsQn1K" style="width: 100px; max-width: 250px;" />
                                        
                                    </td>
    
                                    <!-- <td>
                                        Invoice #:<br />
                                        Created: January 1, 2015<br />
                                    </td> -->
                                    <td style="text-align: right;">
                                    <div style="margin-top: 20px;">
                                        <h2 style="margin-top: 0px; margin-bottom:0px;font-weight: 600;
                                        line-height: 0.8em;">Invoice<br></h2>
                                        <span style="font-size: 16px;  ">Order #&nbsp;<span style="font-size:14px; vertical-align:middle;">${paymentInfo.orderId}</span></span>
                                    </div>
                                    
                                </td>
                                
                                </tr>
                             
                            </table>
                        </td>
                      
                    </tr>
                 
                    <tr class="information">
                        <td colspan="4">
                            <table>
                                <tr>
                                    <td style="font-size: small;">
                                        <b>Billing To, </b><br />
                                        ${userInfo.firstNameString} ${userInfo.lastNameString}<br>
                                        ${addressInfo.firstLineString}<br>
                                        ${addressInfo.secondLineString}<br>
                                        ${addressInfo.thirdLineString}<br>
                                        ${addressInfo.cityNameString} - ${addressInfo.pincodeString}<br>
                                         <abbr title="Phone">M:</abbr> +91-${userInfo.phoneNumberString}
                                    </td>
    
                                    <td style="font-size: small;  text-align: right;">
                                        <b>Shipping To, </b><br />
                                        ${userInfo.firstNameString} ${userInfo.lastNameString}<br>
                                        ${addressInfo.firstLineString}<br>
                                        ${addressInfo.secondLineString}<br>
                                        ${addressInfo.thirdLineString}<br>
                                        ${addressInfo.cityNameString} - ${addressInfo.pincodeString}<br>
                                         <abbr title="Phone">M:</abbr> +91-${userInfo.phoneNumberString}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
    
                    <tr class="information">
                        <td colspan="4">
                            <table>
                                <tr>
                                    
                                    <td style="font-size: small;">  <b>User Details: </b><br />
                                    Name: ${userInfo.firstNameString} ${userInfo.lastNameString}<br />
                                    Email : ${userInfo.emailString}<br />
                                    M: +91-${userInfo.phoneNumberString} <br />
                                     <br />
                                 </td>
                                 <td style=" vertical-align:bottom; font-size: small;  text-align: right;">  
                                   <b> Order Date </b>:  ${orderInfo.dateOfPurchase}
                                </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
    
                    <tr>
                        <td>	<h3>#Order Summery</h3></td>
                    </tr>
                    <tr class="heading">
                        <td>Item</td>
                        <td style="text-align: right;">Qty.</td>
                        <td style="text-align: right;">Price</td>
                        <td style="text-align: right;">Subtotal</td>
                    </tr>
    
                    `+summery+`
    
                    
                    <tr class="total">
                        <td colspan="4">
                            <table>
                                <tr><td style="text-align: right;">Taxes (2.5% SGST + 2.5% CGST):</td>
                                    <td>Rs. ${taxes} </td></tr>
                                <tr><td style="text-align: right;">Total:</td>
                                    <td>Rs. ${total}</td></tr>
                            </table>
                        <br>
                        </td>
                        
                        
                        
                    </tr>
                    <tr class="heading">
                        <td colspan="4"> Payment Info</td>
                    </tr>
    
                    <tr class="paymentInfo">
                        <td>Bank Transaction Id </td>
                        <td><b>:</b></td>
                        <td colspan="2"> ${paymentInfo.bankTxnId}</td>
                    </tr>
                    <tr class="paymentInfo">
                        <td>Bank Name </td>
                        <td><b>:</b></td>
                        <td colspan="2">${paymentInfo.bankName}</td>
                    </tr>
                    <tr class="paymentInfo">
                        <td>Payment Method </td>
                        <td><b>:</b></td>
                        <td colspan="2">${paymentInfo.paymentMode}</td>
                    </tr>
                    <tr class="paymentInfo">
                        <td>Transaction Time </td>
                        <td><b>:</b></td>
                        <td colspan="2">${paymentInfo.txnDate}</td>
                    </tr>
                    <tr class="paymentInfo">
                        <td>Payment Status</td>
                        <td><b>:</b></td>
                        <td colspan="2"> ${paymentStatus}</td>
                    </tr>
                    
                    <tr>
                        <td colspan="4" align="right">
                            <br>
                            <a href="#"  class="btn" onclick="window.print()" role="button" style=" font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center;display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 10 0 10 10; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;"> Print Invoice</a>
                            <p style="font-size: small; padding-right: 15px;">B & C Corporation<br><strong>Nirma University</strong></p>
                        </td>
                    </tr>
                
                    <tr>
                        <td colspan="4">
                            <br>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; text-align:center; margin: 0; Margin-bottom: 15px;">Thanks for the Shopping. You can track the order from your past order.<br>If you have any query than please contact us on <b>help@desk.com</b></p>
                        </td>
                    </tr>
                </table>
            </div>
            </div>
            <br>
            <div>
                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;  width: 100%;">
                    <tr>
                      <td  style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                        <span  style="color: #999999; font-size: 12px; text-align: center;">Cloth Store, Nirma University, Sg-Highway, Ahmedabad - 382470</span>
                        <br> Don't like these emails? <a href="#" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">Unsubscribe</a>.
                      </td>
                    </tr>
                    <tr>
                      <td  style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                        Powered by <a href="#" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">C & B Corp.</a>.
                      </td>
                    </tr>
                  </table>
                </div>
        </body>
    </html>`;

let encodedBody = Buffer.from(template).toString('base64');
var message={
    "eventType":"SIMPLE_EMAIL",
    "recipient":userInfo.emailString,
    "subject":"Order Invoice",
    "text":encodedBody
}

kafkaPublisher.publish(config.kafka.topics.email,message)


//console.log(template);

}

module.exports.sendCancellationInvoice= async(paymentInfo,orderInfo,userInfo,addressInfo)=>{
    var paymentStatus;
    var summery=``;
    var total=0.0;
    var taxes=0.0;
    if(paymentInfo.txnStatus==="TXN_SUCCESS"){
        paymentStatus='<b style="color:green">SUCCEED</b>'
    }else if(paymentInfo.txnStatus==='TXN_FAILURE'){
        paymentStatus='<b style="color:red">FAILED</b>'
    }else{
        paymentStatus='<b style="color:goldenrod">PENDING</b>'
    }

    
    let n = orderInfo.orderItems.length;
    let productInfo = orderInfo.orderItems;
   
   

  for(let i=0; i<n; i++){
        let subtotal = productInfo[i].quantity*productInfo[i].price;

    let temp = `<tr class="item">
    <td>${productInfo[i].productName}</td>
    <td style="text-align: right;">${productInfo[i].quantity}</td>
    <td style="text-align: right;">Rs. ${productInfo[i].price}</td>
    <td style="text-align: right;">Rs. ${subtotal}</td>
    </tr>`;

        summery+=temp;
        total+=subtotal
       
    }
   
    taxes = total*0.05;
    total+=taxes;
    
    let template=`<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>A simple, clean, and responsive HTML invoice template</title>
    
            <style>
                
                .invoice-box {
                    max-width: 800px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #eee;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                    font-size: 16px;
                    line-height: 24px;
                    font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                    color: #555;
                }
    
                .invoice-box table {
                    width: 100%;
                    line-height: inherit;
                    text-align: left;
                }
    
                .invoice-box table td {
                    padding: 5px;
                    vertical-align: top;
                }
    
                .invoice-box table tr td:nth-child(2) {
                    text-align: right;
                }
    
                .invoice-box table tr.top table td {
                    padding-bottom: 20px;
                }
    
                .invoice-box table tr.top table td.title {
                    font-size: 45px;
                    line-height: 45px;
                    color: #333;
                }
    
                .invoice-box table tr.information table td {
                    padding-bottom: 30px;
                }
                .invoice-box table tr.information table td:nth-child(2) {
                    text-align: right;
                }
                .invoice-box table tr.heading td {
                    background: #eee;
                    border-bottom: 1px solid #ddd;
                    font-weight: bold;
                }
    
                .invoice-box table tr.details td {
                    padding-bottom: 20px;
                }
    
                .paymentInfo td{
                    padding: 0px;
                    border-bottom: 2px #eee solid;
                    font-size:13px;
                }
                .invoice-box table tr.item td {
                    border-bottom: 1px solid #eee;
                    font-size: 13px;
                    
                }

                .item{font-size:13px}
    
                
                .invoice-box table tr.item.last td {
                    border-bottom: none;
                }
    
                .invoice-box table tr.total table{
                    
                    font-weight: bold;
                    text-align: right;
                    font-size:14px;
                }
                .invoice-box table tr.total table tr td:nth-child(2){
                    border-bottom: 2px #eee solid;
                }
    
                b{
                    font-size: 14px;
                }
                @media only screen and (max-width: 600px) {
                    .invoice-box table tr.top table td {
                        width: 100%;
                        display: block;
                        text-align: center;
                    }
    
                    .invoice-box table tr.information table td {
                        width: 100%;
                        display: block;
                        text-align: center;
                    }
                }
                @media print {
      body * {
        visibility: hidden;
        font-size: 17px;
      }
      .printable, .printable * {
        visibility: visible;
        font-size:13px ;
      }
      .printable {
          margin:0px;
          padding: 0px;
        position: absolute;
        left: 0;
        top: 0;
       
      }
      .btn{
          visibility: hidden;
      }
    }
    
                /** RTL **/
                .rtl {
                    direction: rtl;
                    font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                }
    
                .rtl table {
                    text-align: right;
                }
    
                .rtl table tr td:nth-child(2) {
                    text-align: left;
                }
            </style>
        </head>
    
        <body style="background-color: #eee; padding:20px">
        <div>
        <div class="invoice-box " style=" color: black; background-color: #fff; width: 60vw; margin-bottom: 10px;">
        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; text-align:justify; margin: 0; Margin-bottom: 15px;">Sorry to inform you but Due to some resone your payment has been failed.<br>As a result we have to canclled your order. You can check order and payment information in the invoice as following : </p>
        </div>
            <div class="invoice-box " style="background-color: #fff; width: 60vw;">
                <div class="printable">
                <table cellpadding="0" cellspacing="0">
                    
                    <tr class="top" >
                        <td colspan="4" style="border-bottom: 2px #eee solid;">
                            <table style="margin: 0px;">
                                <tr>
                                    <td class="title" style="padding: 0px;">
                                        <img src="https://drive.google.com/uc?export=view&id=1ff-kRSSaHkoHEg0mVjzSjC-I4zLsQn1K" style="width: 100px; max-width: 250px;" />
                                        
                                    </td>
    
                                    <!-- <td>
                                        Invoice #:<br />
                                        Created: January 1, 2015<br />
                                    </td> -->
                                    <td style="text-align: right;">
                                    <div style="margin-top: 20px;">
                                        <h2 style="margin-top: 0px; margin-bottom:0px;font-weight: 600;
                                        line-height: 0.8em;">Invoice<br></h2>
                                        <span style="font-size: 16px;  ">Order #&nbsp;<span style="font-size:14px; vertical-align:middle;">${paymentInfo.orderId}</span></span>
                                    </div>
                                    
                                </td>
                                
                                </tr>
                             
                            </table>
                        </td>
                      
                    </tr>
                 
                    <tr class="information">
                        <td colspan="4">
                            <table>
                                <tr>
                                    <td style="font-size: small;">
                                        <b>Billing To, </b><br />
                                        ${userInfo.firstNameString} ${userInfo.lastNameString}<br>
                                        ${addressInfo.firstLineString}<br>
                                        ${addressInfo.secondLineString}<br>
                                        ${addressInfo.thirdLineString}<br>
                                        ${addressInfo.cityNameString} - ${addressInfo.pincodeString}<br>
                                         <abbr title="Phone">M:</abbr> +91-${userInfo.phoneNumberString}
                                    </td>
    
                                    <td style="font-size: small;  text-align: right;">
                                        <b>Shipping To, </b><br />
                                        ${userInfo.firstNameString} ${userInfo.lastNameString}<br>
                                        ${addressInfo.firstLineString}<br>
                                        ${addressInfo.secondLineString}<br>
                                        ${addressInfo.thirdLineString}<br>
                                        ${addressInfo.cityNameString} - ${addressInfo.pincodeString}<br>
                                         <abbr title="Phone">M:</abbr> +91-${userInfo.phoneNumberString}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
    
                    <tr class="information">
                        <td colspan="4">
                            <table>
                                <tr>
                                    
                                    <td style="font-size: small;">  <b>User Details: </b><br />
                                    Name: ${userInfo.firstNameString} ${userInfo.lastNameString}<br />
                                    Email : ${userInfo.emailString}<br />
                                    M: +91-${userInfo.phoneNumberString} <br />
                                     <br />
                                 </td>
                                 <td style=" vertical-align:bottom; font-size: small;  text-align: right;">  
                                   <b> Order Date </b>:  ${orderInfo.dateOfPurchase}
                                </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
    
                    <tr>
                        <td>	<h3>#Order Summery</h3></td>
                    </tr>
                    <tr class="heading">
                        <td>Item</td>
                        <td style="text-align: right;">Qty.</td>
                        <td style="text-align: right;">Price</td>
                        <td style="text-align: right;">Subtotal</td>
                    </tr>
    
                    `+summery+`
    
                    
                    <tr class="total">
                        <td colspan="4">
                            <table>
                                <tr><td style="text-align: right;">Taxes (2.5% SGST + 2.5% CGST):</td>
                                    <td>Rs. ${taxes} </td></tr>
                                <tr><td style="text-align: right;">Total:</td>
                                    <td>Rs. ${total}</td></tr>
                            </table>
                        <br>
                        </td>
                        
                        
                        
                    </tr>
                    <tr class="heading">
                        <td colspan="4"> Payment Info</td>
                    </tr>
    
                    <tr class="paymentInfo">
                        <td>Bank Transaction Id </td>
                        <td><b>:</b></td>
                        <td colspan="2"> ${paymentInfo.bankTxnId}</td>
                    </tr>
                    <tr class="paymentInfo">
                        <td>Bank Name </td>
                        <td><b>:</b></td>
                        <td colspan="2">${paymentInfo.bankName}</td>
                    </tr>
                    <tr class="paymentInfo">
                        <td>Payment Method </td>
                        <td><b>:</b></td>
                        <td colspan="2">${paymentInfo.paymentMode}</td>
                    </tr>
                    <tr class="paymentInfo">
                        <td>Transaction Time </td>
                        <td><b>:</b></td>
                        <td colspan="2">${paymentInfo.txnDate}</td>
                    </tr>
                    <tr class="paymentInfo">
                        <td>Payment Status</td>
                        <td><b>:</b></td>
                        <td colspan="2"> ${paymentStatus}</td>
                    </tr>
                    
                    <tr>
                        <td colspan="4" align="right">
                            <br>
                            <a href="#"  class="btn" onclick="window.print()" role="button" style=" font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center;display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 10 0 10 10; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;"> Print Invoice</a>
                            <p style="font-size: small; padding-right: 15px;">B & C Corporation<br><strong>Nirma University</strong></p>
                        </td>
                    </tr>
                
                    <tr>
                        <td colspan="4">
                            <br>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; text-align:center; margin: 0; Margin-bottom: 15px;">Thanks for the Shopping. You can track the order from your past order.<br>If you have any query than please contact us on <b>help@desk.com</b></p>
                        </td>
                    </tr>
                </table>
            </div>
            </div>
        </div>
            <br>
            <div>
                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;  width: 100%;">
                    <tr>
                      <td  style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                        <span  style="color: #999999; font-size: 12px; text-align: center;">Cloth Store, Nirma University, Sg-Highway, Ahmedabad - 382470</span>
                        <br> Don't like these emails? <a href="#" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">Unsubscribe</a>.
                      </td>
                    </tr>
                    <tr>
                      <td  style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                        Powered by <a href="#" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">C & B Corp.</a>.
                      </td>
                    </tr>
                  </table>
                </div>
        </body>
    </html>`;

let encodedBody = Buffer.from(template).toString('base64');
var message={
    "eventType":"SIMPLE_EMAIL",
    "recipient":userInfo.emailString,
    "subject":"Order Cancelled!!!",
    "text":encodedBody
}

kafkaPublisher.publish(config.kafka.topics.email,message)


//console.log(template);

}

module.exports.sendRefundInvoice= async(refundInfo, message,userInfo)=>{

   // console.log(userInfo);
    const{ orderId, refundResponse}=refundInfo;

    const{
        refId,
        refundId,
        resultInfo,
        refundDetailInfoList,
        refundAmount
    } = refundResponse;

   
    let info=' ';

    let Status;
    if(resultInfo.resultStatus==="TXN_SUCCESS"){
        Status = `<span style="color:green">${resultInfo.resultStatus}</span>`;
    }else{
        Status = `<span style="color:red">${resultInfo.resultStatus}</span>`;
        info = ` 
                <tr>
                    <td>RefrenceId</td>
                    <td>:</td>
                    <td>${resultInfo.resultMsg}</td>
                </tr>`
    }




    if (refundDetailInfoList) {
        const {
            refundType,
            payMethod,
            userMobileNo,
            userCreditExpectedDate
        }=refundDetailInfoList[0]

        info = ` 
                <tr>
                    <td>RefrenceId</td>
                    <td>:</td>
                    <td>${refId}</td>
                </tr>
                <tr>
                    <td>Refund Id</td>
                    <td>:</td>
                    <td>${refundId}</td>
                </tr>
                <tr>
                <td>RefundType</td>
                <td>:</td>
                <td>${refundType}</td>
                </tr>
                <tr>
                <td>Payment Mode</td>
                <td>:</td>
                <td>${payMethod}</td>
                </tr>
                <tr>
                <td>User Mobile No.</td>
                <td>:</td>
                <td>${userMobileNo}</td>
                </tr>
                <tr>
                <td>Expected Credit Date</td>
                <td>:</td>
                <td>${userCreditExpectedDate}</td>
                </tr>`;

    }


    let emailBody=`<!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>OrderRefund</title>
        <style>
        /* -------------------------------------
            INLINED WITH htmlemail.io/inline
        ------------------------------------- */
        /* -------------------------------------
            RESPONSIVE AND MOBILE FRIENDLY STYLES
        ------------------------------------- */
        @media only screen and (max-width: 620px) {
          table[class=body] h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important;
          }
          table[class=body] p,
                table[class=body] ul,
                table[class=body] ol,
                table[class=body] td,
                table[class=body] span,
                table[class=body] a {
            font-size: 16px !important;
            color:  black;
          }
          table[class=body] .wrapper,
                table[class=body] .article {
            padding: 10px !important;
          }
          table[class=body] .content {
            padding: 0 !important;
          }
          table[class=body] .container {
            padding: 0 !important;
            width: 100% !important;
          }
          table[class=body] .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
          }
          table[class=body] .btn table {
            width: 100% !important;
          }
          table[class=body] .btn a {
            width: 100% !important;
          }
          table[class=body] .img-responsive {
            height: auto !important;
            max-width: 100% !important;
            width: auto !important;
          }
        }
    
        /* -------------------------------------
            PRESERVE THESE STYLES IN THE HEAD
        ------------------------------------- */
        @media all {
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
            line-height: 100%;
          }
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
          }
          #MessageViewBody a {
            color: black;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
          .btn-primary table td:hover {
            background-color: #34495e !important;
          }
          .btn-primary a:hover {
            background-color: #34495e !important;
            border-color: #34495e !important;
          }
        }
        </style>
      </head>
      <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
        
        <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
          <tr>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
            <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
              <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
    
                <!-- START CENTERED WHITE CONTAINER -->
                <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
    
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                        <tr>
                          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                          <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, <span style="font-size:15px">${userInfo.firstNameString}&nbsp;${userInfo.lastNameString}</span></p>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${message}</p>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Refund For your order (#${orderId}) has been intiated and will be reflected in 5 business days . </p>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Here are the Refund Details : - </p>
                            
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Click on to below button to start your amazing experience.</p>
                            <table border="0" cellpadding="0" cellspacing="0"  style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                              <tbody>
                                <tr>
                                  <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                    <table border="0" cellpadding="5px" cellspacing="5px" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                      <tbody>
                                        <tr>
                                          <td>OrderId</td>
                                          <td>:</td>
                                          <td>${orderId}</td>
                                        </tr>
                                        `+info+`
                                        <tr>
                                            <td>Refund Amount</td>
                                            <td>:</td>
                                            <td>${refundAmount}</td>
                                        </tr>
                                        <tr>
                                          <td>Refund Status</td>
                                          <td>:</td>
                                          <td>${Status}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                              <tbody>
                                <tr>
                                  <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                      <tbody>
                                        <tr>
                                          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="http://localhost:8081/" target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Go to Portal</a> </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you face any difficulties than please contact us on help@desk.com.</p>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Have a nice Day.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
    
                <!-- END MAIN CONTENT AREA -->
                </table>
    
                <!-- START FOOTER -->
                <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                    <tr>
                      <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                        <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Cloth Store, Nirma University, Sg-Highway, Ahmedabad - 382470</span>
                        <br> Don't like these emails? <a href="#" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">Unsubscribe</a>.
                      </td>
                    </tr>
                    <tr>
                      <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                        Powered by <a href="#" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">C & B Corp.</a>.
                      </td>
                    </tr>
                  </table>
                </div>
                <!-- END FOOTER -->
    
              <!-- END CENTERED WHITE CONTAINER -->
              </div>
            </td>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>`;

    let encodedBody = Buffer.from(emailBody).toString('base64');
var message={
    "eventType":"SIMPLE_EMAIL",
    "recipient":userInfo.emailString,
    "subject":"Order Refund !!!",
    "text":encodedBody
}

kafkaPublisher.publish(config.kafka.topics.email,message)


}

// refundInfo = {
//     refundResponse: {
//         acceptRefundStatus,
//         acceptRefundTimestamp,
//         refundDetailInfoList: [{
//             "refundType": "TO_SOURCE",
//             "payMethod": "BALANCE",
//             "userCreditExpectedDate": "2020-09-08",
//             "userMobileNo": "91-******7777",
//             "refundAmount": "3.00"
//         }],
//         refId,
//         refundId,
//         refundAmount,
//         resultInfo: {
//             "resultStatus": "TXN_SUCCESS",
//             "resultCode": "10",
//             "resultMsg": "Refund Successfull"
//         }
//     },
//     orderId: data.orderId
// }


//   paymentInfoSchema={  
//     eventType: 'PAYMENT',
//     orderId: '7a5859e4-0cd3-4a95-a6af-725808e472b5',
//     bankTxnId: '64431852',
//     bankName: 'WALLET',
//     paymentMode: 'PPI',
//     txnDate: '2021-04-20 22:52:24.0',
//     txnStatus: 'TXN_SUCCESS'
//   }


//   orderInfoSchema=  {
//         userId: '12',
//         addressId: '99',
//         orderItems: [
//           { productId: '14', quantity: 2, price: 1234 },
//           { productId: '14', quantity: 2, price: 1234 }
//         ],
//         dateOfPurchase: '2021-04-20'
//       }


//     user: {
//       userIdInteger: 12,
//       emailString: '17bit005@nirmauni.ac.in',
//       passwordString: '$2a$10$UsUiwACJCYPxZSmu2VlFO.wvymnBQEp7pCj0ikPzLt5bFlXgNel12',
//       firstNameString: 'Apurva',
//       lastNameString: 'De Greate',
//       phoneNumberString: '987654321',
//       seller: false
//     }

 // addressSchema={
    //     addressIdInteger: 99,
    //     firstLineString: '34,naroli heights,',
    //     secondLineString: 'gakao chowk, rase course,',
    //     thirdLineString: 'ambavadi Nagar',
    //     cityNameString: 'Rajkot',
    //     pincodeString: '354264',
    //     user: {
    //       userIdInteger: 12,
    //       emailString: '17bit005@nirmauni.ac.in',
    //       passwordString: '$2a$10$UsUiwACJCYPxZSmu2VlFO.wvymnBQEp7pCj0ikPzLt5bFlXgNel12',
    //       firstNameString: 'Apurva',
    //       lastNameString: 'De Greate',
    //       phoneNumberString: '987654321',
    //       seller: false
    //     }
    //   }