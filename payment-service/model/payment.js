const mongoose= require('mongoose');
const paymentSchema = new mongoose.Schema({

    orderId:{
        type:String,
        required:true
    },
    txnId:{
        type:String,
        required:true,
        unique:true
    },
    
});

module.exports= mongoose.model('Payment', paymentSchema, "payments");