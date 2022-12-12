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
        required: true
    },
    imgs: [
        {
            type: String,
            required: true,
        }
    ],
    shortDescription: {
        type: String,
        required: true,
    },
    mrp:{
        type:Number,
        required:true
    },
    offer:{
        type:Number,
        min:0,
        max:100
    },
    price: {
        type: Number,
        required: true,
    },
    avgRating: {
        type: Number,
        default:0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    feature: {
        brand: {
            type: String
        },
        color: {
            type: String
        },
        material:{
            type:String
        },
        suitedFor:{
            type:String
        }
    },
    sizes: [
        {
            value: {
                type: String,
                required: true
            },
            stock: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    manufacturer: {
        
            sellerId:{
                type:String,
                required:true
            },
            companyName:{
                type:String,
                required:true
            }
    },
    available: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", productSchema, "ProductCopy");
