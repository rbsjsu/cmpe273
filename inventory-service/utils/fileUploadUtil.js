const multer = require("multer");
const path = require("path")
const shortid=require("shortid")
const slugify= require('slugify')

// ==================== Uploder middleware to setup file/files object ===============================================

exports.fileUpload = (uploader)=>{
    return function(req,res,next){
        uploader(req,res, (err)=>{
            if(!err){
                next();
            }else{
                res.status(500).json({message:"Error occured uploading the image please try again !!!"})
                // console.log(err);
            }
        }); 
    }  
}

// ==================== Category Storage ===============================================
 
exports.categoryImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
       
        cb(null, path.join(path.dirname(__dirname), "/uploads/category"));
    },
    filename: function (req, file, cb) {
            cb(null, "dept-" + slugify(req.body.title)+"."+file.mimetype.split("/")[1]);
    },
});

// ==================== Product Storage ===============================================

exports.productImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
       // console.log(path.dirname(__dirname))
        cb(null,  path.join(path.dirname(__dirname), "/uploads/products") );
    },
    filename: function (req, file, cb) {
        
            cb(null, slugify(req.body.title) + "-" + shortid.generate()+"."+file.mimetype.split("/")[1]);
    },
});

// ==================== Banner Storage ===============================================

exports.bannerImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,  path.join(path.dirname(__dirname), "/uploads/banner") );
    },
    filename: function (req, file, cb) {
            cb(null, "banner-"+ slugify(req.body.title)+"."+file.mimetype.split("/")[1]);
    },
});




// ==================== Backup ===============================================





// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         let uri;
//         if (req.body.category) { uri = path.join(path.dirname(__dirname), "/InventoryService/uploads/category") }
//         else { uri = path.join(path.dirname(__dirname), "/InventoryService/uploads/products") }
//         cb(null, uri);
//     },
//     filename: function (req, file, cb) {
//         //   cb(null, shortid.generate() + "-" + file.originalname);
//         if (req.body.category) {
//             cb(null, "dept-" + slugify(req.body.name)+"."+file.mimetype.split("/")[1]);
//         } else {
//             console.log(file.mimetype.split("/")[1])
//             cb(null, slugify(req.body.name) + "-" + shortid.generate()+"."+file.mimetype.split("/")[1]);
//         }
//     },
// });