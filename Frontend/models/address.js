const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = Schema({
    addressId:{
        type: Number,
        required:true
    },
    firstLine:{
        type:String,
        required:true
    },
    secondLine:{
        type:String,
        required: true
    },
    thirdLine:{
        type:String,
        required:true
    },
    cityName:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Address", addressSchema);