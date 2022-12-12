const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = Schema({
 name:{
     type:String,
     required:true
 },
 rating:{
     type:Number,
     required:true
 },
 reviewText:{
    type:String
 },
  productCode: {
    type: String,
    required: true,
    
  },
   createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
