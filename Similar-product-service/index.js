const express = require('express');
const eurekaClient = require('./eurekaHelper').client;

const conf = require("./config.json");

const uri = conf.database.uri;

const MongoClient = require('mongodb').MongoClient;
var client = new MongoClient(uri,{ useUnifiedTopology: true});


const productApi = require('./controllers/similarProductController');
const app = express();
app.use(express.json());
app.use(express.urlencoded());



// app.get('/', productApi.ping);
// app.post('/', productApi.ping2);
app.get('/similar',productApi.getSimilar);






eurekaClient.start( error => {
   console.log(error || "This service registered")
 });


var coll;
var server = app.listen(conf.server.port, async()=>{
    // if(!err){
    //     console.log("Server running at port " + server.address().port);
    // }

    try{
        console.log("Server running at port " + server.address().port);
        await client.connect();
        coll = client.db(conf.database.name).collection(conf.database.collection);
        app.coll=coll;
        console.log("Database Connected Successfully");
    }catch(e){
        console.log(e);
    }
});


/**
 * Index - similarity
 * 
 * {
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

