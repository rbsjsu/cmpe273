const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Category = require("../models/category");
const mongoose = require("mongoose");
const connectDB = require("./../config/db");
connectDB();

let subcat=[
  "Backpacks",
  "Briefcases",
  "Mini Bags",
  "Large Handbags",
  "Travel",
  "Totes",
  "Purses"
];
let cat=[
  "Mens",
  "Womens",
  "Kids",
  "Footwear",
  "Accessories"
]
async function seedDB() {
  async function seedCateg(titleStr) {
    try {
      const categ = await new Category({ 
        title: titleStr
       });
      await categ.save();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

 

  //await getSubcategory();
  for(let i=0; i<subcat.length; i++){
    await seedCateg(subcat[i]);
  }
  
  
}

async function seedDB2() {
  async function seedCateg(titleStr, subcategoryArr) {
    try {
      const categ = await new Category({ 
        title: titleStr,
       subcategories:subcategoryArr
       });
      await categ.save();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function closeDB() {
    console.log("CLOSING CONNECTION");
    await mongoose.disconnect();
  }
  
  
  async function getSubcategory(){
   
    let rand = Math.floor(Math.random()*subcat.length);
    rand=rand+(rand==0?1:0);
    //console.log(rand);
    let subc=[];
    while(rand-->0){
      let rand2 = Math.floor(Math.random()*(subcat.length-1));
      //console.log(subcat[rand2]);
      let category = await Category.findOne({title:subcat[rand2]});
  
      subc.push(category._id);
    }
    return subc;
  }

  //await getSubcategory();
  for(let i=0; i<cat.length; i++){
    await seedCateg(cat[i], await getSubcategory());
  }
  
  closeDB()
}

//seedDB();
seedDB2();
