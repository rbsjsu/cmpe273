const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const Review = require("../models/review");
var moment = require("moment");
const axios=require("axios");
const category = require("../models/category");

// GET: display all products
router.get("/", async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  const perPage = 50;
  let page = parseInt(req.query.page) || 1;
  try {
    // const products = await Product.find({})
    //   .sort("-createdAt")
    //   .skip(perPage * page - perPage)
    //   .limit(perPage)
    //   .populate("category");


    // const count = await Product.count();
    

    const temp = await axios.get("http://localhost:3004/products?page="+page);
    const data= temp.data
    
  
    res.render("shop/index", {
      pageName: "All Products",
      products:data.products,
      filter:data.filter,
      successMsg,
      errorMsg,
      current: page,
      breadcrumbs: null,
      home: "/products/?",
      pages:data.pages
    });
  } catch (error) {
    console.log(error);
    res.redirect("http://localhost:8081/api/");
  }
});

// GET: search box
router.get("/search", async (req, res) => {
  const perPage = 50;
  let page = parseInt(req.query.page) || 1;
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];


  try {
    
    const response = await axios.get("http://localhost:3010/fulltext/search?text="+req.query.search+"&page="+page); 
    const data = response.data;

    res.render("shop/index", {
      pageName: "Search Results",
      products:data.products,
      filter:data.filter,
      searchQuery:req.query.search,
      successMsg,
      errorMsg,
      current: page,
      breadcrumbs: null,
      home: "/products/search?search=" + req.query.search + "&",
      pages: data.pages,
    });
  } catch (error) {
    console.log(error);
    res.redirect("http://localhost:8081/api/");
  }
});

//GET: get a certain category by its slug (this is used for the categories navbar)
router.get("/:slug", async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  const perPage = 50;
  let page = parseInt(req.query.page) || 1;
  try {

  const response = await axios.get("http://localhost:3004/products/"+req.params.slug+"?page="+page);
  const data = response.data;

  //   const foundCategory = await Category.findOne({ slug: req.params.slug }).populate("subcategories");
  //  const subProducts=await getProducts(foundCategory.subcategories);
  //  const allProducts =  await Product.find({ category: foundCategory.id })
  //     .sort("-createdAt")
  //     .skip(perPage * page - perPage)
  //     .limit(perPage)
  //     .populate("category");


  //   const count = await Product.count({ category: foundCategory.id });
  // console.log(foundCategory.subcategories);
    //console.log(subProducts.length)

   if(data.render==="page"){
     
    res.render("shop/page", {
      pageName: data.pageName,
      currentCategory: data.currentCategory,
      subcategories: data.subcategories,
      products: data.products,
      successMsg,
      errorMsg,
      current: data.page,
      breadcrumbs: req.breadcrumbs,
      home: "/products/" + req.params.slug.toString() + "/?",
      pages: data.pages,
    });
   }else{

   // let filters = await getFilter(allProducts);
    
    res.render("shop/index", {
      pageName: data.pageName,
      currentCategory: data.currentCategory,
      products: data.products,
      filter: data.filter,
      successMsg,
      errorMsg,
      current: data.page,
      breadcrumbs: req.breadcrumbs,
      home: "/products/" + req.params.slug.toString() + "/?",
      pages: data.pages,
    });
   }
  
  } catch (error) {
    console.log(error.message);
    return res.redirect("http://localhost:8081/api/");
  }
});

// GET: display a certain product by its id
router.get("/:slug/:id", async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  try {
   
    var products=[]
    // **************** products array needs to contains similar products to the current product *************
    //**************** call the similar product service later when backend is connected right now its random */
     try{
      // console.log(req.params.id.toString());
      data= await axios.get("http://localhost:3001/similar?id="+req.params.id.toString())
      products=data.data;
       
     }catch(e){
       console.log("ERROR IN GETTING SIMILAR PRODUCTS:" + e.message)
       products=[];
     }
    // const product = await Product.findById(req.params.id).populate("category");
  try{
    // *************** Get product Details From INVENTORY service ***********************

      
      const response = await axios.get("http://localhost:3004/product/" + req.params.id)
      let product = response.data;

      // ***** Get Review Details From Review service *********
      var reviews = [];

      try {
        
        let rdata = await axios.get("http://localhost:9009/review/product/"+ product.productCode)
        reviews = rdata.data;

      } catch (error) {
        console.log("ERROR IN GETTING REVIEWS" + error.message);
        reviews = [];
      }

    

      //check wishlist
      var inWishlist;
          try {
            // check wishlist
            const cookie = req.cookies.authCookie;
            var wdata = await axios.get("http://localhost:8081/bookmark-service/bookmarks/" + product.productCode, { headers: {Cookie: "authCookie="+cookie+";"} });
            inWishlist = wdata.data;
          } catch (e) {
            console.log(e.message);
            inWishlist = false;
          }
              
      // *************** Render the Page ***********************
      console.log("length-"+products.length)
      res.render("shop/product", {
        pageName: product.title,
        products,
        product,
        reviews,
        successMsg,
        errorMsg,
        inWishlist,
        moment: moment,
      });

    }catch(e){
      if (e.response) {
        let status = e.response.status;
        res.render("shop/error", {
          pageName: "Home",
          message: status + " Product not found!!!",
          successMsg,
          errorMsg
        })
      } else {
        console.log(e.message);
        res.redirect("http://localhost:8081/api/");
      }
    }
    
  } catch (error) {
    console.log(error.message);
    return res.redirect("http://localhost:8081/api/");
  }
});



async function getProducts(subcategories){
  var products=[];
 for(let i=0; i<subcategories.length; i++){
      let product = await Product.find({category:subcategories[i]}).limit(3).populate("category");
     
      product.forEach(p=>products.push(p));
  }
  console.log(products);
  return products;
}

async function getFilter(products){
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


await products.forEach(product=>{
   if(product.category){category.add(product.category.title);} 
  
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
  category: [...category]

}

return filter;
}
module.exports = router;
