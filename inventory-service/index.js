const express=require('express')
const jwt = require('jwt-simple');
const app=express()
const cors=require('cors')
const controller=require("./controller");
const config = require('./config');
const mongoose = require('mongoose');
const multer = require("multer");
const {fileUpload ,categoryImageStorage, productImageStorage, bannerImageStorage} = require("./utils/fileUploadUtil");
const kafkaListner = require("./kafka/KafkaListner");

const eurekaHelper = require('./eurekaHelper');
eurekaHelper.registerWithEureka(config.application.name, config.server.port);
//========================FILE_UPLOAD Middeleware===========================================================\

const categoryImgUpload= fileUpload(multer({ storage: categoryImageStorage }).single('img'))
const productImgUpload= fileUpload(multer({ storage: productImageStorage }).array('img',4))
const bannerImgUpload= fileUpload(multer({ storage: bannerImageStorage }).single('img'))



//========================JWT-DECODER===========================================================
var jwtDecode = (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        let token = req.headers.authorization.split(' ');
        if (token && token.length > 0 && token[0] === 'Bearer') {
            var authorization = token[1],
                decoded;
            // console.log(authorization)

            try {
                decoded = jwt.decode(authorization, config.jwtSecret, true);
            } catch (e) {
                return res.status(401).send(e.message);
            }


            req.user = {
                id:decoded.payload,
                //role:decoded.role,
                // id: "459874815",
                role: "admin",
                email: decoded.sub,
            }
        }
        next();
    }else{
        res.status(401).send({message:"Authorization token missing."});
    }
    
}

//==================================APPLY-MIDDLEWARE==============================================

// app.use(jwtDecode)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('uploads'))


//==================================DEFINE-ROUTES==============================================

app.get("/",controller.ping);
app.get("/available", controller.checkAvailability)
app.get("/products/:slug", controller.getProductsBySlug);
app.get("/product/:code", controller.getProductByCode);
app.get("/products",controller.getAllProducts)
app.get("/categories",controller.getRootCategories);
app.get("/latest/products", controller.getLatestProducts);

// app.get("/api/category/getcategory", controller.getCategories);
app.get("/seller/products/:sid", jwtDecode,controller.getProductsBySellerId);

app.post("/category/create",jwtDecode,categoryImgUpload, controller.createCategory);
app.post("/category/banner/:slug", jwtDecode,bannerImgUpload, controller.addBanner);
app.post("/product/update",jwtDecode,productImgUpload,controller.updateProduct);
app.post("/category/update/",jwtDecode,categoryImgUpload, controller.updateCategory);
app.post("/product/create",jwtDecode,productImgUpload,controller.createProduct);
app.post("/product/image/add/:code",jwtDecode,productImgUpload,controller.addProductImg);

app.delete("/product/image/delete/:code",jwtDecode,controller.deleteProductImg);
app.delete("/category/delete/:slug",jwtDecode, controller.deleteCategory);
app.delete("/product/delete/:code",jwtDecode, controller.deleteProduct);
app.post("/test",controller.test)


//==================================SERVER-START===============================================
let port = config.server.port;
mongoose.connect(config.db.uri,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,

     },(err)=>{
    if(err)
    {console.log("connections - "+ err)}
    else{
        
        console.log("Databse Connected Sucessfully !!!");
        // kafkaListner.kafkaSubscribe(config.kafka.topics.inventory);
    }
});

app.listen(port,async()=>{
    console.log(`APP IS RUNNING AT ${port}`)    
})




