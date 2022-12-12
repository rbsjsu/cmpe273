
// const MongoClient = require('mongodb').MongoClient;
// const client= new MongoClient(uri,{useUnifiedTopology:true});
// var coll;
// var temp = async()=>{
//   try{
//     await client.connect();
//    coll = client.db('sample_mflix').collection('movies');
//    console.log("Database connected successfully!!!");
//  }catch(e){
//    console.log(e);
//  }
 
// };
// temp();


/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */
const conf = require('../config.json');

exports.ping = async(req,res)=>{
  //console.log("hit" + temp);
 
    res.send("working fine");
}
//---------------------------------------------------------------------------------

exports.ping2 =async (req,res)=>{
  res.send(req.body.name);
}

const perPage=50;
//---------------------------------------------------------------------------------

exports.autocomplete = async(req,res)=>{
  
try{
  const agg =conf.searchAggragate.autocomplete;
  
  //res.send(req.params['text']);
  if(!req.query.text){
    res.status(400).send("Bad Request");
  }else{
   
 var coll = req.app.coll;
  agg[0].$search.autocomplete.query=req.query.text;
console.log(req.query.text)
   //MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(connectErr, client) {
    
     // const coll = client.db('sample_mflix').collection('movies');
      coll.aggregate(agg).toArray()
                          // .then(result=> result.map(ele=>{
                          //   return {label:ele.title, value:ele.title};
                          // }))
                          .then(result=>{
                            let ar = new Array();
                            result.forEach(element => {
                              ar.push(element.title);
                            });
                           //console.log(ar);
                          res.send(ar);
                            //res.send(result);
                            // //console.log(result[0]);
                             console.log("Query -'" + req.query.text + "' result found-" + result.length);
                             //client.close();
                          });
   // });

  }
}catch(e){
  res.status(500).send({message:e.message});
}
  
}

//---------------------------------------------------------------------------------

exports.searchProduct= async(req,res)=>{
 
try{
  const agg =conf.searchAggragate.fullTextSearch;
  
let page = req.query.page||1;
  //res.send(req.body.text);
  if(!req.query.text){
    res.status(400).send("Bad Request");
  }else{
  agg[0].$search.text.query=req.query.text;
  // agg[3].$skip =page*perPage-perPage;
  
    var coll = req.app.coll;

     let result = await coll.aggregate(agg).toArray()
      let data = result.map(product=>{
        if(product.category.length>0){
          let temp = product.category[0];
          product.category=temp;
        }else{
          product.category=null;
        }
        return product;
      })

      let pages = Math.ceil(data.length/perPage);
      let temp = page*perPage-perPage+1;

      let products = data.slice(temp,temp+perPage);
      let filter =  await getFilter(products);
      res.json({pages,filter,products });

       console.log("Query -'" + req.body.text + "' result found-" + result.length);

    
 
  }
}catch(e){
  res.status(500).send({message:e.message});
}
}



var getFilter=async function(products){
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
