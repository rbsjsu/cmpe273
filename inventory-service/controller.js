const slugify = require("slugify")
const fs = require('fs');
const path= require('path')

const Category = require("./model/category");
const Product = require('./model/product');

const {getProducts, getFilter, deleteImgFile} =  require("./utils/helper");


const perPage=50

exports.ping=(req,res)=>{
    res.send("Alive");
}
exports.test = (req,res)=>{
  res.send(req.body.title);
}

// ======================= Check avaibility of product ================================================

exports.checkAvailability = async(req,res)=>{

  let code = req.query.productCode;
  let qsize = req.query.size;
  let qty = req.query.qty;
 // console.log(code + " " + size+ " " + qty)

  const product = await Product.findOne({productCode:code}).catch(e=>{console.log(e); res.send({available:false})});
  if(product){
      let sizes = product.sizes.filter(size=>size.value==qsize);
     if(sizes.length>0){
          if(sizes[0].stock>=qty){
            res.json({available:true});
          }else{
            res.json({available:false})
          }
     }else{
       res.status(404).json({message:"size not found", available:false});
     }
      
  }else{
    res.status(404).send({message:"Product not found", available:false});
  }
  
}

// ======================= GET Products by Seller Id ================================================
exports.getProductsBySellerId = async (req, res)=>{
  // check if he is seller
  if(req.user.role.toLowerCase()==='admin' ||(req.user.role.toLowerCase()==='seller' && req.user.id!=req.params.sid)){
    const producuts = await Product.find({"manufacturer.sellerId":req.params.sid}).populate("category");
    res.json(producuts);
  }else{
    res.sendStatus(401)
  }
}

// ======================= GET Latest Products ================================================
exports.getLatestProducts = async(req,res)=>{

 
  let products  = await Product.find({})
                              .populate("category")
                              .sort("-createdAt")
                              .limit(10)
  res.json(products);
}

// ======================= GET ALL ================================================
exports.getAllProducts = async(req,res)=>{

  let page = parseInt(req.query.page) || 1;
  let products  = await Product.find({})
                              .populate("category")
                              .sort("-createdAt")
                              .skip(perPage * page - perPage)
                              .limit(perPage)
                           
                              // let temp = products.filter(product=>{return product.category==null?product:null});
    //  res.send(temp)

  let filter = await getFilter(products);
  const count = await Product.countDocuments();
  let response = {
    pageName: "All Products",
    filter,
    current: page,
    breadcrumbs: null,
    home: "/products/?",
    pages: Math.ceil(count / perPage),
    products
  }
  res.json(response);
}

// ======================= GET BY SLUG ================================================

exports.getProductsBySlug = async (req, res) => {
  let slug = req.params.slug;
  let page = parseInt(req.query.page) || 1;

  let category = await Category.findOne({ slug: slug }).populate('subcategories').catch(e => { console.log(e); res.send(500); });

  if (category) {
    let subProducts = await getProducts(category.subcategories);
    let allProducts = await Product.find({ category: category._id })
                                .sort("-createdAt")
                                .skip(perPage * page - perPage)
                                .limit(perPage)
                                .populate("category")
                                .exec()
                                .catch(e=>{console.log(e); res.send(500)});

    let count =  await Product.countDocuments({ category: category._id })
      let response;                          
      if(category.subcategories && category.subcategories.length>0){
          response={
            render:"page",
            pageName:category.title,
            currentCategory:category,
            subcategories:category.subcategories,            
            current: page,
            products:subProducts,
            home: "/products/" + req.params.slug.toString() + "/?",
            pages: Math.ceil(count / perPage),
          }
      }else{
        let filters = await getFilter(allProducts) 
        response={
          render:"index",
          pageName:category.title,
          currentCategory:category,         
          current: page,
          pages:Math.ceil(count/perPage),
          products:allProducts,
          filter:filters,
          home: "/products/" + req.params.slug.toString() + "/?",
        }
      }
    
       res.send(response);                       
  }


}

// ======================= GET BY PRODUCT CODE ================================================

exports.getProductByCode = async(req,res) =>{
  let code = req.params.code;
  let product = await Product.findOne({productCode:code}).populate("category").catch(e=>{console.log(e); res.send(500)});
  if(product){
    res.json(product);
  }else{
    res.send(404);
  }
}

// ======================= GET BY ROOT CATEGORIES ================================================

exports.getRootCategories = async(req,res)=>{
  let categories = await Category.find({"subcategories.0":{"$exists":true}}).exec();
  res.send(categories);
}


// ======================= Create Product ================================================

exports.createProduct = async(req, res) => {

  // console.log(req.user.role);
  // check for admin
  if (req.user.role.toLowerCase() == 'seller') {
    let {
      title,
      shortDescription,
      price,
      mrp,
      category,
      brand,
      color,
      material,
      suitedFor,
      size,
      qty,
      available
    } = req.body;
    let imgs = [];

    if (req.files.length > 0) {
      imgs = req.files.map((file) => {
        return "/products/" + file.filename;
      });
    }

    // fetchSeller info
    let manufacturer = {
      sellerId: req.user.id,
      companyName: "Hello faker"
    }
    //build sizes
    let sizes=[];
    for(let i=0; i<size.length && i<qty.length; i++){
        sizes.push({value:size[i], stock:qty[i]});
    }
    //get categoryId
    let cat = await Category.findOne({slug:category}).catch(e=>{console.log(e)});

    let productObj = {
      productCode: new Date().getTime().toString().slice(4),
      title,
      shortDescription,
      imgs,
      category:cat._id,
      price,
      mrp,
      offer: Math.floor(((mrp - price) / mrp) * 100),
      feature: {
        brand,
        color,
        material,
        suitedFor
      },
      sizes,
      available,
      manufacturer
    }
    const product = new Product(productObj);

    // res.send(productObj)
    product.save((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(201).json({ product });
      }
    });

  } else {
    res.status(401).json({ message: "Only authorized seller can create product" });
  }
}

// ======================= Update Product ================================================

exports.updateProduct = async (req, res) => {

  // console.log(req.user.role);
  // check for Seller
  //console.log(req.user.id);
  if (req.user.role.toLowerCase() == 'seller') {

    let {
      productCode,
      title,
      shortDescription,
      price,
      mrp,
      category,
      brand,
      color,
      material,
      suitedFor,
      size,
      qty,
      available
    } = req.body;
   // console.log(req.body);

    let cat = await Category.findOne({slug:category});

    if (productCode) {
      let product = await Product.findOne({ productCode: productCode }).catch(e => { console.log(e); res.status(500) });

   if(product.manufacturer.sellerId==req.user.id){

      product.title = title,
        product.shortDescription = shortDescription,
        product.price = price,
        product.mrp = mrp,
        product.category = cat._id,
        product.feature.brand = brand,
        product.feature.color = color,
        product.feature.material = material,
        product.feature.suitedFor = suitedFor,
        product.feature.available = available

      let sizes = [];
      for (let i = 0; i < size.length && i < qty.length; i++) {
        sizes.push({ value: size[i], stock: qty[i] });
      }
      product.sizes = sizes,
        product.offer = Math.floor(((mrp - price) / mrp) * 100)

      product.save().catch(e => { console.log(e); res.status(500) });

      res.send(product);

    }else{
      res.status(401).send({message:"Not Authorized!!"});
    }
    } else {
      res.status(400).send("productCode not available");
    }

  } else {
    res.status(401).json({ message: "Only authorized seller can create product" });
  }
}

// ======================= Delete Product ================================================

exports.deleteProduct = async (req, res) => {
  
  // console.log(req.user.role);
  // check for Seller
  if (req.user.role.toLowerCase() == 'seller') {
    if(req.params.code){
        let product = await Product.findOne({productCode:req.params.code}).catch(e=>{console.log(e); res.status(500)})
        if(product){
          if(product.manufacturer.sellerId==req.user.id){
          product.imgs.forEach(img=>deleteImgFile("/"+ img));
          product = await Product.deleteOne({productCode:req.params.code}).catch(e=>{console.log(e); res.status(500)});
          res.send(product);
        }else{
          res.status(404).send({message:"prodcut Not found..."})
        }
      }else{
        res.status(401).send({message:"Not Authorized"});
      }
      }else{
      res.status(400).send({message:"productCode not found!!!"})
    }
  } else {
    res.status(401).json({ message: "Only authorized seller can create product" });
  }
}
// ======================= Create Category ================================================


exports.createCategory = async (req, res) => {
  // console.log(req.user.role);
  // check for admin
  if (req.user.role.toLowerCase() == 'admin') {
    let categoryObj = {
      title: req.body.title,
      img: req.file.filename
    }
    const cat = new Category(categoryObj);

    await cat.save().then(response => response).catch(e => { console.log(e); res.status(500).send(); });


    if (req.body.parent) {
      let parent = await Category.findOne({ slug: req.body.parent }).exec();
      if (parent) {
        parent.subcategories.push(cat._id);
        await parent.save();
      }
    }

    let category = await Category.findById(cat._id);
    let response = { category };

    res.send(response)
  } else {
    res.status(401).send({ message: "Only Admin can create categories !!" });
  }

}


// ======================= Delete Category ================================================

exports.deleteCategory = async (req, res) => {
    
 // console.log(req.user.role);
  // check for admin
  if (req.user.role.toLowerCase() == 'admin') {
            
        const deleteCategory = await Category.findOneAndDelete({ slug: req.params.slug }).catch(e => { res.status(500).json({ message: "Something went wrong" }); });
        if (deleteCategory) {

        // remove Imge files 
          deleteImgFile("/category/"+deleteCategory.img)
          deleteImgFile("/banner/"+deleteCategory.bannerImg);
           

        // remove it from the parents
          let update = await Category.updateMany({}, { $pull: { "subcategories": deleteCategory._id } })
          console.log(update.nModified+" parent category updated !!!");
          

          res.status(201).json({ message: "Categories removed", cetegory: deleteCategory });
        } else {
          res.status(404).json({ message: "Category not found!!!" });
        }
    }else{
        res.status(401).send({message:"Only Admin can create categories !!"});
    }
    
  
  };

// ======================= Update Category ================================================

exports.updateCategory = async (req, res) => {
  // console.log(req.user.role);
  // check for admin
  if (req.user.role.toLowerCase() == 'admin') {

    const category = await Category.findOne({ slug: req.body.slug }).catch(e => { console.log(e); res.send(500) });

    if (category) {

      if (req.body.title) {
        category.title = req.body.title;
        category.slug = slugify(category.title);
      }

      if (req.file) {
        category.img = req.file.filename;
      }

      category.save().catch(e => { console.log(e); res.send(500) });
      res.status(201).send(category);

    } else {
      res.send(404);
    }

  } else {
    res.status(401).send({ message: "Only Admin can create categories !!" });
  }
};

// ======================= Add Banner Image ================================================


exports.addBanner = async (req, res) => {
  // console.log(req.user.role);
  // check for admin
  if (req.user.role.toLowerCase() == 'admin') {

    let category = await Category.findOne({ slug: req.params.slug }).catch(e => { console.log(e); res.send(500) });
    if (category) {
      category.bannerImg = req.file.filename;
      category.save().catch(e => { console.log(e); res.status(500).send(); });
      res.send(category);
    } else {
      res.send(404);
    }
  } else {
    res.status(401).send({ message: "Only Admin can create categories !!" });
  }
}

// ======================= Add Producut Image ================================================


exports.addProductImg = async (req, res) => {
  // console.log(req.user.role);
  // check for admin
  if (req.user.role.toLowerCase() == 'seller') {
    let code= req.params.code;
      let product = await Product.findOne({productCode:code}).catch(e=>{console.log(e); res.status(500)})
      if(product){
          if(product.manufacturer.sellerId==req.user.id){
            req.files.forEach(file=>{product.imgs.push("/products/" + file.filename);})
            res.status(200).send({message:"added succesfully"});
          }else{
            res.status(401).send({message:"This product is not authorized to you!!"})
          }
      }else{
        res.status(404).send({message:"Product Not Found!!!"});
      }

    } else {
    res.status(401).send({ message: "Only Admin can create categories !!" });
  }
}

// ======================= Delete Producut Image ================================================


exports.deleteProductImg = async (req, res) => {
  // console.log(req.user.role);
  // check for admin
  if (req.user.role.toLowerCase() == 'seller') {
    let code= req.params.code;
    
    var uri = req.body.imguri;
   // console.log(temp);
      let product = await Product.findOne({productCode:code}).catch(e=>{console.log(e); res.status(500)})
      if(product){
        if(product.manufacturer.sellerId==req.user.id){
          product.imgs.remove(uri);
          deleteImgFile(uri);
          product.save().catch(e=>{console.log(e)})
          res.status(200).send({message:"deleted Succesfully!!!"});
          }else{
            res.status(401).send({message:"This product is not authorized to you!!"})
          }
      }else{
        res.status(404).send({message:"Product Not Found!!!"});
      }

    } else {
    res.status(401).send({ message: "Only Admin can create categories !!" });
  }
}
  // exports.getCategories=(req,res)=>{
//     Category.find().exec((err,categories)=>{
//         if(err){
//             res.status(400).send({"error": err})
//         }else{
//            let categoryList = createCategoryTree(categories);

//            res.status(200).send({categoryList});
//         }
//     })
// }

// function createCategoryTree(categoryList,parentId=null){
//     let categoryTree = []
//     let filteredCategories;
//     if(parentId==null){
//         filteredCategories=categoryList.filter(cat=>cat.parentId == undefined);
//     }else{
//         filteredCategories=categoryList.filter(cat => cat.parentId == parentId);
//     }

//     for(let category of filteredCategories){
//         categoryTree.push({
//             _id:category._id,
//             name: category.name,
//             slug: category.slug,
//             children: createCategoryTree(categoryList,category._id)
//         })
//     }

//     return categoryTree;
    
// }
