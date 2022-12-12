const express = require("express");
const csrf = require("csurf");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");
const Address = require("../models/address");
const middleware = require("../middleware");
const fetch = require("node-fetch");
const { route } = require("./user");
const router = express.Router();
const axios = require('axios');

const csrfProtection = csrf();
router.use(csrfProtection);

router.get("/status/:orderId", async (req, res) => {
  // console.log(req.session.cart);
 // console.log(req.params.orderId);
 try{
  let data = await axios.get(`http://localhost:5000/status/${req.params.orderId}`)
    res.render("shop/status", {payment:data.data});
 }catch(e){
   console.log(e.message);
   res.redirect("http://localhost:8081/api");
 }
  
  });

//   if (!req.session.cart) {
//     return res.redirect("/shopping-cart");
//   }
//   const cart = await Cart.findById(req.session.cart._id);

//   const order = new Order({
//     user: req.user,
//     cart: {
//       totalQty: cart.totalQty,
//       totalCost: cart.totalCost,
//       items: cart.items,
//     },

//     paymentId: payment.txnId,
//   });
//   await order.save(async (err, newOrder) => {
//     if (err) {
//       console.log("shit man ");
//       console.log(err);
//       return res.redirect("/checkout");
//     }
//     await cart.save();
//     await Cart.findByIdAndDelete(cart._id);
//     req.flash("success", "Successfully purchased");
//     req.session.cart = null;
//   });

//   res.render("shop/status", { pageName: "Status", payment });
//   // "response": {
//   //   "resultInfo": {
//   //     "resultStatus": "TXN_SUCCESS",
//   //     "resultCode": "01",
//   //     "resultMsg": "Txn Success"
//   //   },
//   //   "txnId": "20210425111212800110168080303628670",
//   //   "bankTxnId": "64453087",
//   //   "orderId": "orId1619367052642",
//   //   "txnAmount": "123.00",
//   //   "txnType": "SALE",
//   //   "gatewayName": "WALLET",
//   //   "bankName": "WALLET",
//   //   "mid": "mcvFNv59890172268275",
//   //   "paymentMode": "PPI",
//   //   "refundAmt": "0.00",
//   //   "txnDate": "2021-04-25 21:40:52.0",
//   //   "feeRateFactors": {}
//   // }
// });

// GET: home page
router.get("/", async (req, res) => {
  var recProducts = [];
  var products = [];
  try {
    products = await getLatestProducts(req); 
    recProducts = await getRecommendations(req);
    res.render("shop/home", { pageName: "Home", products, recProducts });
  } catch (error) {
    console.log(error);
    res.render("error",{message:"Somthing went wrong !!! please try again", error});
  }
});

//function to get the recommended products
async function getRecommendations(req) {

  try {
  
    const cookie = req.cookies.authCookie;
    const response = await axios.get('http://localhost:8081/recommender-service/recommend', { headers: {Cookie: "authCookie="+cookie+";"} });
    //console.log(response.data);
    return response.data;

  } catch (error) {
    console.log("ERROR IN GETTING RECOMMENDATIONS" + error);
    return [];
  }
}

async function getLatestProducts(req) {
  try {
  
    const response = await axios.get('http://localhost:3004/latest/products');
    //console.log(response.data);
    return response.data;

  } catch (error) {
    console.log("ERROR IN GETTING LATEST PRODUCTS" + error);
    return [];
  }
}

// GET: add a product to the shopping cart when "Add to cart" button is pressed
router.get("/add-to-cart/:id/:size", async (req, res) => {
  const productCode = req.params.id;
  const size = req.params.size.toString();
  // console.log(size);
  try {
    // get the correct cart, either from the db, session, or an empty cart.
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }
    let cart;
    if (
      (req.user && !user_cart && req.session.cart) ||
      (!req.user && req.session.cart)
    ) {
      cart = await new Cart(req.session.cart);
    } else if (!req.user || !user_cart) {
      cart = new Cart({});
    } else {
      cart = user_cart;
    }

    // add the product to the cart
    const product = await Product.findOne({ productCode: productCode });

    const itemIndex = cart.items.findIndex((p) => {
      let a = p.productId.toString();
      let b = product._id.toString();
      return a == b && p.size == size;
    });
    //console.log(itemIndex);
    if (itemIndex > -1) {
      // if product exists in the cart, update the quantity
      cart.items[itemIndex].qty++;
      cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
      cart.totalQty++;
      cart.totalCost += product.price;
    } else {
      // if product does not exists in cart, find it in the db to retrieve its price and add new item
      cart.items.push({
        productId: product._id,
        qty: 1,
        price: product.price,
        title: product.title,
        productCode: productCode,
        size: size,
      });
      cart.totalQty++;
      cart.totalCost += product.price;
    }

    // if the user is logged in, store the user's id and save cart to the db
    if (req.user) {
      cart.user = req.user._id;
      await cart.save();
    }
    req.session.cart = cart;
    req.flash("success", "Item added to the shopping cart");
    res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

// GET: view shopping cart contents
router.get("/shopping-cart", async (req, res) => {
  try {
    // find the cart, whether in session or in db based on the user state
    let cart_user;
    if (req.user) {
      cart_user = await Cart.findOne({ user: req.user._id });
    }
    // if user is signed in and has cart, load user's cart from the db
    if (req.user && cart_user) {
      req.session.cart = cart_user;
      return res.render("shop/shopping-cart", {
        cart: cart_user,
        pageName: "Shopping Cart",
        products: await productsFromCart(cart_user),
        addresses: await getAddresses(),
      });
    }
    // if there is no cart in session and user is not logged in, cart is empty
    if (!req.session.cart) {
      return res.render("shop/shopping-cart", {
        cart: null,
        pageName: "Shopping Cart",
        products: null,
      });
    }
    // otherwise, load the session's cart
    return res.render("shop/shopping-cart", {
      cart: req.session.cart,
      pageName: "Shopping Cart",
      products: await productsFromCart(req.session.cart),
      addresses: await getAddresses(),
    });
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

// GET: reduce one from an item in the shopping cart
router.get("/reduce/:id/:size", async function (req, res, next) {
  // if a user is logged in, reduce from the user's cart and save
  // else reduce from the session's cart
  const productCode = req.params.id;
  const size = req.params.size;
  let cart;
  try {
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (req.session.cart) {
      cart = await new Cart(req.session.cart);
    }

    // find the item with productId
    let itemIndex = cart.items.findIndex((p) => {
      let a = p.productCode.toString();
      return a == productCode && p.size == size;
    });
    if (itemIndex > -1) {
      // find the product to find its price
      const product = await Product.findOne({ productCode: productCode });
      // if product is found, reduce its qty
      cart.items[itemIndex].qty--;
      cart.items[itemIndex].price -= product.price;
      cart.totalQty--;
      cart.totalCost -= product.price;
      // if the item's qty reaches 0, remove it from the cart
      if (cart.items[itemIndex].qty <= 0) {
        await cart.items.remove({ _id: cart.items[itemIndex]._id });
      }
      req.session.cart = cart;
      //save the cart it only if user is logged in
      if (req.user) {
        await cart.save();
      }
      //delete cart if qty is 0
      if (cart.totalQty <= 0) {
        req.session.cart = null;
        await Cart.findByIdAndRemove(cart._id);
      }
    }
    res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

// GET: remove all instances of a single product from the cart
router.get("/removeAll/:id/:size", async function (req, res, next) {
  const productCode = req.params.id;
  const size = req.params.size;
  let cart;
  try {
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (req.session.cart) {
      cart = await new Cart(req.session.cart);
    }
    //fnd the item with productId
    let itemIndex = cart.items.findIndex((p) => {
      let a = p.productCode.toString();
      return a == productCode && p.size == size;
    });
    if (itemIndex > -1) {
      //find the product to find its price
      cart.totalQty -= cart.items[itemIndex].qty;
      cart.totalCost -= cart.items[itemIndex].price;
      await cart.items.remove({ _id: cart.items[itemIndex]._id });
    }
    req.session.cart = cart;
    //save the cart it only if user is logged in
    if (req.user) {
      await cart.save();
    }
    //delete cart if qty is 0
    if (cart.totalQty <= 0) {
      req.session.cart = null;
      await Cart.findByIdAndRemove(cart._id);
    }
    res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

// // GET: checkout form with csrf token
// router.get("/checkout", middleware.isLoggedIn, async (req, res) => {
//   const errorMsg = req.flash("error")[0];

//   if (!req.session.cart) {
//     return res.redirect("/shopping-cart");
//   }
//   //load the cart with the session's cart's id from the db
//   cart = await Cart.findById(req.session.cart._id);
//   let receiptId = new Date().getTime().toString();
//   const errMsg = req.flash("error")[0];
//   res.render("shop/checkout", {
//     total: cart.totalCost.toFixed(2),
//     csrfToken: req.csrfToken(),
//     receiptId,
//     errorMsg,
//     pageName: "Checkout",
//   });
// });

// // POST: handle checkout logic and payment using Stripe
// router.post("/checkout", middleware.isLoggedIn, async (req, res) => {
//   if (!req.session.cart) {
//     return res.redirect("/shopping-cart");
//   }
//   const cart = await Cart.findById(req.session.cart._id);

//   const order = new Order({
//     user: req.user,
//     cart: {
//       totalQty: cart.totalQty,
//       totalCost: cart.totalCost,
//       items: cart.items,
//     },

//     paymentId: new Date().getTime().toString(),
//   });
//   order.save(async (err, newOrder) => {
//     if (err) {
//       console.log(err);
//       return res.redirect("/checkout");
//     }
//     await cart.save();
//     await Cart.findByIdAndDelete(cart._id);
//     req.flash("success", "Successfully purchased");
//     req.session.cart = null;
//     res.redirect("/user/profile");
//   });
// });

// create products array to store the info of each product in the cart
async function productsFromCart(cart) {
  let products = []; // array of objects
  for (const item of cart.items) {
    let foundProduct = (
      await Product.findById(item.productId).populate("category")
    ).toObject();
    foundProduct["size"] = item.size;
    foundProduct["qty"] = item.qty;
    foundProduct["totalPrice"] = item.price;
    products.push(foundProduct);
  }
  return products;
}

async function getAddresses() {
  var addresses = [];

  const temp = await Address.find({}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      //console.log("result:" + result);
      addresses = result;
    }
  });

  //console.log(addresses);
  return addresses;
}

module.exports = router;
