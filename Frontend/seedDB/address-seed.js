const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Address = require("../models/address");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
connectDB();


async function seedDb(){

    async function seedAddresses() {
      try {
       
        let address1 = new Address({
            addressId:18,
            firstLine:"Building Name",
            secondLine:"Street Name",
            thirdLine:"Road Name",
            cityName:"City Name",
            pincode:"pincode"
        });

        await address1.save();

        let address2 = new Address({
            addressId:19,
            firstLine:"Building Name",
            secondLine:"Street Name",
            thirdLine:"Road Name",
            cityName:"City Name",
            pincode:"pincode"
        });

        await address2.save();
      } catch (error) {
        console.log(error);
        return error;
      }
    }
  
    async function closeDB() {
      console.log("CLOSING CONNECTION");
      await mongoose.disconnect();
    }
  
      await seedAddresses();
      await closeDB();
  }
  
  seedDb()
  