const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = Schema({
    sellerId: {
        type: String,
        required: true,
        unique: true,
    },
    companyName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Seller", sellerSchema);
