
$( function() {
$( "#search-box" ).autocomplete({
    source: (req,res)=>{
      $.get(`http://localhost:3010/search?text=${req.term}`, (data)=>{
          res(data);
      })
    },
    // source:data,
    minLength:2,
    autofocus:true,
    select:(event, ui)=>{
        let text = ui.item.value;
     window.location.href="http://localhost:8081/api/products/search?search="+text;
        // console.log(ui.item.value)
    }
  });

});


var data=[
    "Plain White Cotton Tote",
    "Elegant Red Leather Tote",
    "Handmade Embroided White Tote with Red Roses",
    "Multicolored White Tote",
    "Owl White Cotton Tote",
    "Simple Grey Zipped Tote",
    "Earth Positive Tote Bag",
    "Deep Purple Handstamped Tote",
    "White Cotton Tote with Drawings",
    "Grey Wolf Tote",
    "Yellow and Green Bold Tote",
    "Hot Pink Leather Purse",
    "Glittery Black Purse with Golden Strap",
    "Practical Black Leather Purse",
    "Red Leather Pouche with Free Earrings",
    "Lavender Leather Purse",
    "White and Black Snakeskin Purse",
    "Dark Brown Simple Purse",
    "Red Kipling Pouche",
    "Biege Kipling Pouche", "Elegant Shiny Brown Leather Handbag",
    "Black Leather Handbag with Golden Chains",
    "Elegant Black Leather Handbag",
    "Stylish Blue Handbag with its Purse",
    "A set of Two Elegant Handbags",
    "Practical Blue Leather Handbag with its Purse",
    "Simple Black Leather Handbag",
    "Golden Leather Handbag",
    "Shiny Black Leather Handbag",
    "Gray and Yellow Flowery Shoulder Bag",
    "Blue and Brown Leather Handbag with Shoulder Strap",
    "Pink Leather Crossbody Bag",
    "Stylish Pink Crossbody Bag",
    "Mini Black Carra Shoulder Bag",
    "White Leather Mini Bag with Crossbody Strap",
    "Blue Jeans Mini Bag",
    "Biege Be Dior Mini Bag with Crossbody Strap",
    "Red Be Dior Mini Bag with Crossbody Strap",
    "Light Blue Mini Bag with Golden Strap",
    "Light Green Mini Bag with Golden Strap",
    "Pastel Pink Mini Bag with Golden Strap",
    "Biege Leather Crossbody Bag",
    "White Leather Crossbody Bag",
    "Elegant White Mini Bag with Silver Strap",
    "Simple Red Mini Bag",
    "Stylish Pastel Pink Travel Bag",
    "A Fahionable Set of Two Pink Travel Bags",
    "White and Black Hard Luggage",
    "Rainbow Dotted Duffle Bag Luggage",
    "Blue and Gray Classic Suitcase",
    "A Set of Three Hard Durable Suitcases",
    "Light Blue Hard Luggage",
    "Black Leather Vintage Suitcase",
    "A Set of Three Large Travel Bags",
    "Two Stylish Light Green Travel Bags With Different Sizes",
    "Simple Blue Luggage with Many Compartments",
    "Classic Blue Backpack",
    "Black Fjallraven Backpack",
    "Brown and Green Leather Backpack",
    "Grey Stylish Backpack",
    "Elegant Black Backpack",
    "Practical Blue Backpack With Leather Straps",
    "Soft Classic Biege Backpack",
    "Practical Durable Backpack",
    "Comfortable Laptop Backpack",
    "Extra Large Grey Backpack",
]