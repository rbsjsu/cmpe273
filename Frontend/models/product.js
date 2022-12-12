const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  avgRating: {
    type: Number
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  brand:{
    type:String
  },
  color:{
    type:String
  },
  manufacturer: {
    type: String,
  },
  sizes:[
    {
      value:{
        type: String,
        required: true
      },
      stock:{
        type: Number,
        required:true,
        min:0
      }
    }
  ],
  available: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
