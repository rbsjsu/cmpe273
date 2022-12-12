const conf = require('../config.json');




// exports.ping = async(req,res)=>{
//     res.send("working fine");
// }

exports.getSimilar = async(req,res)=>{
  try{
    const agg =conf.searchAggragate.similarity;
    if(!req.query.id){
      res.status(400).send({"message":"Product id missing in request"});
    }else{
      

      
      var coll = req.app.coll;
    
      let result = await coll.findOne({productCode:req.query.id});
   
        agg[0].$search.text.query=result.title+" "+result.shortDescription;
    
      

    //   agg[0].$search.text.query=temp.data[0].longDescription;
       agg[3].$match.productCode.$ne=req.query.id;
    //  // console.log(agg[0].$search.text.query);
      let data = await coll.aggregate(agg).toArray()
      let products = data.map(product=>{
        if(product.category.length>0){
          let temp = product.category[0];
          product.category=temp;
        }else{
          product.category=null;
        }
        return product;
      })               
      res.send(products);
      //console.log(result[0]);
      //client.close();
      console.log("ProdcutCode- " + req.query.id + " result found-" + products.length);

                               
    }
  }catch(e){
    console.log(e.message)
    res.status(500).send({message:e.message});
  }
}



