const Product = require("../model/product");
const kafkaPublisher = require("./KafkaPublisher");
const config = require("../config");

exports.consumeMessage=(msg)=>{
    let data = JSON.parse(msg.value);
   // console.log(data);
    if(data.eventType==='confirmed'){
        reserveStock(data.products);
    }else if(data.eventType==='returned'){
        releaseStock(data.product);
    }
}

var releaseStock = async(product)=>{
    let data = await findProduct({ productId: product.productId });
    let quantity = data.inStock + product.quantity;
    await Product.findOneAndUpdate({ productId: product.productId }, { inStock: quantity },{new:true});
           
}

var reserveStock=async(products)=>{
    let i;
    let flag=true;
   for( i=0; i<products.length; i++){
     
       let product = await findProduct({ productId: products[i].productId });
      
       if (product.inStock < products[i].quantity) {
           canceleOrderEvent(products[i].orderId);
       } else {
           let quantity = product.inStock - products[i].quantity;
           await Product.findOneAndUpdate({ productId: product.productId }, { inStock: quantity },{new:true});
           
       }
   }

   console.log("Stockupdated....");
   
}


const findProduct = async function (params) { 
    try {  return await Product.findOne(params).then(res=>res)
    } catch(err) { console.log(err) }
}

const canceleOrderEvent=(orderId)=>{

    let msg={
        eventType:"canceled",
        orderId:orderId,
        status:"CANCELED"
    }

    kafkaPublisher.publish(config.kafka.topics.order,msg);
    let msg2={
        eventType:"OutOfStock",
        orderId:orderId
    }

    kafkaPublisher.publish(config.kafka.topics.payment,msg2);

}