const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Seller = require("../models/seller");
const mongoose = require("mongoose");
const faker = require("faker");
const connectDB = require("./../config/db");
const { FORMERR } = require("dns");
connectDB();

async function seedDB() {
  faker.seed(0);

 

  async function seedSeller() {
    try {
      let seller = new Seller({
          sellerId: faker.helpers.replaceSymbolWithNumber("#########"),
          companyName: faker.company.companyName(0)
        });
        await seller.save();
      
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function closeDB() {
    console.log("CLOSING CONNECTION");
    await mongoose.disconnect();
  }

 for(let i=0; i<6; i++){
     await seedSeller();
 }

  await closeDB();
}

seedDB();
