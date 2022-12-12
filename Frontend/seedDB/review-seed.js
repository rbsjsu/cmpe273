const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Product = require("../models/product");
const Review = require("../models/review");
const mongoose = require("mongoose");
const faker = require("faker");
const connectDB = require("../config/db");
connectDB();



async function seedDb(){
  faker.seed(0);

 

  // const names = [
  //   "Rutvik Borad",
  //   "Aurva Chandarana",
  //   "Niketan Chandarana",
  //   "Swapnil Chadotra",
  //   "Dhyey Choksi"
  // ];
  async function seedProducts(ids) {
    try {
     
      for (let i = 0; i < ids.length; i++) {
        let temp = Math.floor((Math.random()*6)+1);
        for( let j=0; j<temp; j++){
        let review = new Review({
          name:faker.name.findName(),
          reviewText: faker.lorem.paragraph(),
          rating: ((Math.random() * 4)+1).toFixed(1),
          productCode: ids[i].productCode
        });
        await review.save();
        }
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function closeDB() {
    console.log("CLOSING CONNECTION");
    await mongoose.disconnect();
  }


    let ids = await Product.find({},{productCode:true, _id:true});
    await seedProducts(ids);
    await closeDB();
}

seedDb()
