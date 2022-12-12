require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const Category = require("./models/category");
var MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
const axios = require('axios');

const eurekaHelper = require('./eurekaHelper');
const conf = require("./config.json");
const jwt = require('jwt-simple');

eurekaHelper.registerWithEureka(conf.application.name, conf.server.port);

const app = express();
require("./config/passport");

// mongodb configuration
connectDB();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// admin route
const adminRouter = require("./routes/admin");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET|| "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    //session expires after 3 hours
    cookie: { maxAge: 60 * 1000 * 60 * 3 },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// global variables across routes
app.use(async (req, res, next) => {
  try {
    var userAttributes = {
      role: "",
      id: -1,
      fullName: "",
      email: "",
      cartSize: 0,
      bookmarkSize: 0,
    }

    if(req.cookies.authCookie){
      userAttributes.cartSize = await getCartSize(req);
      userAttributes.bookmarkSize = await getBookmarkSize(req);
      const decoded = jwt.decode(req.cookies.authCookie,"secret", true);
      userAttributes.email = decoded.sub;
      userAttributes.id = decoded.payload;
      userAttributes.fullName = decoded.fullName;
      userAttributes.role = decoded.role;
      console.log(userAttributes);
    }

    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.currentUser = req.user;
    res.locals.userAttributes = userAttributes;
    const cat = await axios.get("http://localhost:3004/categories");
    res.locals.categories = cat.data;
    next();
  } catch (error) {
    console.log(error);
    res.redirect("http://localhost:8081/api/");
  }
});

//function to get the cart size using axios get
async function getCartSize(req) {
  const cookie = req.cookies.authCookie;
  var cartSize = 0;
  try {
    const response = await axios.get('http://localhost:8081/cart-service/get-cart-size', { headers: {Cookie: "authCookie="+cookie+";"} });
    return response.data;
  } catch (error) {
    console.log("ERROR IN GETTING CART SIZE app.js:" + error);
    return 0;
  }
  
}

//function to get the number of products in wishlist
async function getBookmarkSize(req) {
  const cookie = req.cookies.authCookie;

  try {
    
    const response = await axios.get('http://localhost:8081/bookmark-service/bookmarks-size', { headers: {Cookie: "authCookie="+cookie+";"} });
    return response.data;

  } catch (error) {
    console.log("ERROR IN GETTING BOOKMARK SIZE" + error);
    return 0;
  }

  
}

// add breadcrumbs
get_breadcrumbs = function (url) {
  var rtn = [{ name: "Home", url: "/" }],
    acc = "", // accumulative url
    arr = url.substring(1).split("/");

  for (i = 0; i < arr.length; i++) {
    acc = i != arr.length - 1 ? acc + "/" + arr[i] : null;
    rtn[i + 1] = {
      name: arr[i].charAt(0).toUpperCase() + arr[i].slice(1),
      url: acc,
    };
  }
  return rtn;
};
app.use(function (req, res, next) {
  req.breadcrumbs = get_breadcrumbs(req.originalUrl);
  next();
});

//routes config
const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/user");
const pagesRouter = require("./routes/pages");

app.use("/admin", adminRouter);


app.use("/products", productsRouter);
app.use("/user", usersRouter);
app.use("/pages", pagesRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var port = process.env.PORT || 3000;
app.set("port", port);
app.listen(port, () => {
  console.log("Server running at port " + port);
});

module.exports = app;
