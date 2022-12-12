const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const categorySchema = Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    slug: "title",
  },
  subcategories:[
    {
     
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
      
    }
  ],
  img:{
    type:String
  },
  bannerImg:
    {
      type:String
    }
  
});

module.exports = mongoose.model("Category", categorySchema);
