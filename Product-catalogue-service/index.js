const express = require('express');
const eurekaHelper = require('./eurekaHelper');
const cors = require('cors');
const conf = require("./config.json");

// const uri = conf.database.uri;
const uri = conf.database.uri;


const MongoClient = require('mongodb').MongoClient;
var client = new MongoClient(uri,{ useUnifiedTopology: true});


const productApi = require('./controllers/productCatalogController');
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded());






app.get('/', productApi.ping);
// app.post('/', productApi.ping2);
app.get('/search',productApi.autocomplete);
app.get('/fulltext/search',productApi.searchProduct);
// app.get('/product',productApi.searchProductById);
// app.get('/product/seller',productApi.searchProductsBySellerId);





eurekaHelper.registerWithEureka(conf.application.name, conf.server.port);

var coll;
var server = app.listen(conf.server.port, async()=>{
    // if(!err){
    //     console.log("Server running at port " + server.address().port);
    // }

    try{
        console.log("Server running at port " + server.address().port);
        await client.connect();
        // coll = client.db(conf.database.name).collection(conf.database.collection);
        coll = client.db(conf.database.name).collection(conf.database.collection);

        app.coll=coll;
        console.log("Database Connected Successfully");
    }catch(e){
        console.log(e);
    }
});


/**
 * Index - FullTextSearch
 * 
 *{
  "analyzer": "lucene.simple",
  "searchAnalyzer": "lucene.simple",
  "mappings": {
    "dynamic": false,
    "fields": {
      "feature": {
        "fields": {
          "brand": {
            "analyzer": "lucene.simple",
            "indexOptions": "docs",
            "norms": "omit",
            "searchAnalyzer": "lucene.simple",
            "type": "string"
          },
          "color": {
            "analyzer": "lucene.keyword",
            "indexOptions": "docs",
            "norms": "omit",
            "searchAnalyzer": "lucene.keyword",
            "type": "string"
          },
          "material": {
            "analyzer": "lucene.keyword",
            "indexOptions": "docs",
            "norms": "omit",
            "searchAnalyzer": "lucene.keyword",
            "type": "string"
          },
          "suitedFor": {
            "analyzer": "lucene.keyword",
            "indexOptions": "docs",
            "searchAnalyzer": "lucene.keyword",
            "type": "string"
          }
        },
        "type": "document"
      },
      "manufacturer": {
        "fields": {
          "companyName": {
            "analyzer": "lucene.whitespace",
            "ignoreAbove": 50,
            "indexOptions": "docs",
            "searchAnalyzer": "lucene.whitespace",
            "type": "string"
          }
        },
        "type": "document"
      },
      "shortDescription": {
        "analyzer": "lucene.simple",
        "ignoreAbove": null,
        "norms": "omit",
        "searchAnalyzer": "lucene.simple",
        "type": "string"
      },
      "title": {
        "analyzer": "lucene.simple",
        "ignoreAbove": 255,
        "norms": "omit",
        "searchAnalyzer": "lucene.simple",
        "type": "string"
      }
    }
  }
}


Index Autocomplete

{
  "analyzer": "lucene.simple",
  "searchAnalyzer": "lucene.english",
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "maxGrams": 20,
        "type": "autocomplete"
      }
    }
  }
}


Index similarity

{
  "analyzer": "lucene.english",
  "searchAnalyzer": "lucene.english",
  "mappings": {
    "dynamic": false,
    "fields": {
      "longDescription": {
        "analyzer": "lucene.english",
        "ignoreAbove": 255,
        "indexOptions": "freqs",
        "norms": "omit",
        "searchAnalyzer": "lucene.english",
        "type": "string"
      },
      "type": {
        "analyzer": "lucene.keyword",
        "indexOptions": "docs",
        "searchAnalyzer": "lucene.keyword",
        "store": false,
        "type": "string"
      }
    }
  }
}
 */

