const Product = require('../model/product');
const Category = require("../model/category");
const fs = require('fs');
const path= require('path')

exports.getProducts = async function(subcategories){
    var products=[];
   for(let i=0; i<subcategories.length; i++){
        let product = await Product.find({category:subcategories[i]}).limit(3).populate("category");
       
        product.forEach(p=>products.push(p));
    }
    //console.log(products);
    return products;
  }


exports.getFilter=async function(products){
 
    let brand= new Set()
    let color= new Set()
    let sizeSet= new Set()
    let price={
      min: Number.MAX_VALUE,
      max: 0
    }
    let material= new Set()
    let suitedFor= new Set()
    let category= new Set()
    let catobj=[]

  await products.forEach(product=>{
     if(product.category){
       if(!category.has(product.category.title)){
         category.add(product.category.title);
         catobj.push({title:product.category.title, slug:product.category.slug});
       }
     } 
    
    brand.add(product.feature.brand);
    color.add(product.feature.color);
    material.add(product.feature.material);
    suitedFor.add(product.feature.suitedFor);
    product.sizes.forEach(size=> size.stock>0? sizeSet.add(size.value) : "");
  
    if(product.price <price.min){
      price.min = Math.floor(product.price);
    }
    if(product.price >price.max){
      price.max = Math.ceil(product.price);
    }
  })

  let filter = {
    brand:[...brand],
    color: [...color],
    size: [...sizeSet],
    price:{
      min: price.min,
      max: price.max
    },
    material: [...material],
    suitedFor:[...suitedFor],
    category: catobj
  
  }

  return filter;
}

exports.deleteImgFile = async function (imgPath) {
  let filePath = path.join(path.dirname(__dirname) + "/uploads/" + imgPath)
  try {
    fs.unlinkSync(filePath);
  } catch (e) {
    console.log(e.message);
  }
}