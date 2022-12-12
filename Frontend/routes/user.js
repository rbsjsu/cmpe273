const express = require("express");
const router = express.Router();
const csrf = require("csurf");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const Product = require("../models/product");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");
const middleware = require("../middleware");
const url = require('url');
const axios = require('axios');
const jwt = require('jwt-simple');

const {
  userSignUpValidationRules,
  userSignInValidationRules,
  validateSignup,
  validateSignin,
} = require("../config/validator");
const { Cookie } = require("express-session");
const address = require("../models/address");
const { response } = require("../app");
const csrfProtection = csrf();
router.use(csrfProtection);

router.get("/authenticate", (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  res.render("user/authenticate", {
    pageName: "Authentication Page",
    queryObject,
  });
});

// GET: display the signup form with csrf token
router.get("/signup", middleware.isNotLoggedIn, (req, res) => {
  var errorMsg = req.flash("error")[0];
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "Sign Up",
  });
});
// POST: handle the signup logic
router.post(
  "/signup",
  [
    middleware.isNotLoggedIn,
    userSignUpValidationRules(),
    validateSignup,
    passport.authenticate("local.signup", {
      successRedirect: "http://localhost:8081/api/user/profile",
      failureRedirect: "http://localhost:8081/api/user/signup",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
      //if there is cart session, save it to the user's cart in db
      if (req.session.cart) {
        const cart = await new Cart(req.session.cart);
        cart.user = req.user._id;
        await cart.save();
      }
      // redirect to the previous URL
      if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect("http://localhost:8081/api/user/profile");
      }
    } catch (err) {
      console.log(err.message);
      req.flash("error", err.message);
      return res.redirect("http://localhost:8081/api/");
    }
  }
);

// GET: display the signin form with csrf token
router.get("/signin", middleware.isNotLoggedIn, async (req, res) => {
  var errorMsg = req.flash("error")[0];
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "Sign In",
  });
});

// POST: handle the signin logic
router.post(
  "/signin",
  [
    middleware.isNotLoggedIn,
    userSignInValidationRules(),
    validateSignin,
    passport.authenticate("local.signin", {
      failureRedirect: "/user/signin",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
      // cart logic when the user logs in
      let cart = await Cart.findOne({ user: req.user._id });
      // if there is a cart session and user has no cart, save it to the user's cart in db
      if (req.session.cart && !cart) {
        const cart = await new Cart(req.session.cart);
        cart.user = req.user._id;
        await cart.save();
      }
      // if user has a cart in db, load it to session
      if (cart) {
        req.session.cart = cart;
      }
      res.setHeader("Authorization", "yupp its comming back");
      // redirect to old URL before signing in
      if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect("http://localhost:8081/api/user/profile");
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("http://localhost:8081/api/");
    }
  }
);

// GET: display user's profile
router.get("/profile", middleware.isLoggedIn, async (req, res) => {
  console.log(req.headers);
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  try {
    // find all orders of this user
    allOrders = await Order.find({ user: req.user });
    res.render("user/profile", {
      orders: allOrders,
      errorMsg,
      successMsg,
      pageName: "User Profile",
    });
  } catch (err) {
    console.log(err);
    return res.redirect("http://localhost:8081/api/");
  }
});

//GET: Display user profile. User will be shown the information that he can update
router.get("/my-profile", middleware.isAuthorised, async (req, res) => {
  console.log("profile page");

  const cookie = req.cookies.authCookie;
  //console.log("jwt string:" + cookie);
  var userDetails = {};

  try {
    const response = await axios.get('http://localhost:8081/user-service/user', { headers: {Cookie: "authCookie="+cookie+";"} }, );
    userDetails = response.data;
  } catch (error) {
    console.log("ERROR IN GETTING USER DETAILS:" + error.message);
  }

  res.render("user/my-profile", {
    userDetails,
    pageName: "User Profile",
  });

});

router.get("/my-addresses", async (req, res) => {

  const cookie = req.cookies.authCookie;
  var addresses = []
  const queryObject = url.parse(req.url, true).query;

  try {
    const response = await axios.get('http://localhost:8081/user-service/addresses', { headers: {Cookie: "authCookie="+cookie+";"} });
    addresses = response.data;
  } catch (error) {
    console.log("ERROR IN GETTING ADDRESSES:" + error.message);
  }

  res.render("user/my-addresses", {
    pageName: "My Addresses",
    addresses,
    queryObject,
  });

});

router.get("/change-password", async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  res.render("user/change-password", {
    pageName: "Change Password",
    queryObject
  });
});

router.get("/become-seller", async (req,res) => {
  var sellerObj = {}
  const cookie = req.cookies.authCookie;
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject);
  if(res.locals.userAttributes.role == "seller") {
    try {
      const response = await axios.get('http://localhost:8081/user-service/get-seller-company', { headers: {Cookie: "authCookie="+cookie+";"} } );  
      sellerObj = response.data
    } catch (error) {
      console.log("ERROR IN GETTING SELLER COMPANY NAME:" + error.message);
    }
  }
  res.render("user/become-seller", {
    pageName: "Become Seller",
    sellerObj,
    queryObject,
  });
});

router.get("/my-orders", async (req, res) => {
  const cookie = req.cookies.authCookie;
  var orders = [];
  const queryObject = url.parse(req.url, true).query;

  try {
    
    const response = await axios.get('http://localhost:8081/order-service/user/my-orders', { headers: {Cookie: "authCookie="+cookie+";"} });
    orders = response.data;
//  console.log("orders");
//  console.log(orders);

  } catch (error) {
    console.log("ERROR IN GETTING ORDERS:" + error.message);
  }

  var userReviews = [];

  var userId = -1;
  const decoded = jwt.decode(req.cookies.authCookie,"secret", true);
  userId = decoded.payload;

  try {
    const response = await axios.get("http://localhost:9009/review/user?id="+ userId);
    userReviews = response.data;
  } catch (error) {
    console.log("CANNOT GET REVIEWS FOR USER ID:" + userId + "," + error.message);
  }
  // console.log(userReviews);
  for (const order of orders) {
    try {
    
      const data = await axios.get('http://localhost:3004/product/'+order.productIdInteger);
      let product = data.data;
      //console.log(product);
      order.brand = product.feature.brand;
      order.color=product.feature.color;  
    } catch (error) {
      console.log("ERROR IN GETTING ORDERS:" + error.message);
    }
  }

   

  for(let i=0; i<orders.length; i++){
    for(let j=0; j<userReviews.length; j++){
      if(String(orders[i].orderIdInteger)==userReviews[j].orderId){
        console.log(orders[i]);
        orders[i].review=userReviews[j]
      }
    }
  }
  // console.log(orders);
  
  

  res.render("user/my-orders", {
    pageName: "My Orders",
    orders,
    queryObject,
  });

});

router.get("/my-wishlist", async (req, res) => {

  if(req.cookies.authCookie) {
    res.render("user/my-wishlist", {
      pageName: "My Wishlist",
      products: await getBookmarkProducts(req),
    });
  }
  else {
    res.redirect("http://localhost:8081/api/user/authenticate");
  }

  
});

router.get("/forgot-password", async(req, res) => {
  const queryObject = url.parse(req.url, true).query;
  res.render("user/forgot-password", {
    pageName: "Forgot Password",
    queryObject,
  });
});

router.get("/register", async (req, res) => {
  res.render("user/register", {
    pageName: "Register",
    errorMsg: "",
  });
});

// GET: logout
router.get("/logout", middleware.isLoggedIn, async (req, res) => {
  req.logout();
  req.session.cart = null;
  res.redirect("http://localhost:8081/api/");
});

router.get("/my-cart", async (req, res) => {

  if(req.cookies.authCookie) {
    try {
    
      const queryObject = url.parse(req.url, true).query;
      var products = [];
      var addresses = await getAddresses(req);
      //products = await getCartProducts(req);
      //addresses = await getAddresses(req);
      //console.log(products);
      //console.log(addresses);
      res.render("user/my-cart", {
      pageName: "My Cart",
      products: await getCartProducts(req),
      addresses,
      totalBill: 0,
      queryObject,
      });
  
  
    } catch (error) {
      console.log(error.message);
      res.redirect("http://localhost:8081/api/")
    }
  }
  else {
    res.redirect("http://localhost:8081/api/user/authenticate");
  }

  
  
});



async function getCartProducts(req) {
  const cookie = req.cookies.authCookie;

  try {
    
    const response = await axios.get('http://localhost:8081/cart-service/get-cart', { headers: {Cookie: "authCookie="+cookie+";"} });
    return response.data;

  } catch (error) {
    console.log("ERROR IN GETTING CART:" + error);
    return [];
  }

  
}

async function getAddresses(req){
  const cookie = req.cookies.authCookie;

  try {
    const response = await axios.get('http://localhost:8081/user-service/addresses', { headers: {Cookie: "authCookie="+cookie+";"} });
    return response.data;  
  } catch (error) {
    console.log("ERROR IN GETTING ADDRESSES:" + error);
    return [];
  }

  
}

async function getBookmarkProducts(req) {
  const cookie = req.cookies.authCookie;

  try {
    
    const response = await axios.get('http://localhost:8081/bookmark-service/bookmarks', { headers: {Cookie: "authCookie="+cookie+";"} });
    //console.log(response.data);
    return response.data;

  } catch (error) {
    console.log("Error in getting bookmarks:" + error);
    return [];
  }

  
}

module.exports = router;
