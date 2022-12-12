let middlewareObject = {};

//a middleware to check if a user is logged in or not
middlewareObject.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("http://localhost:8081/api/");
};

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("http://localhost:8081/api/user/authenticate");
};

middlewareObject.isAuthorised = (req, res, next) => {
  console.log(req.cookies);
  console.log(req.cookies.authCookie);
  if(req.cookies.authCookie) {
    return next();
  }
  else {
    console.log("redireirecting....");
    res.redirect("http://localhost:8081/api/user/authenticate");
  }
}

module.exports = middlewareObject;
