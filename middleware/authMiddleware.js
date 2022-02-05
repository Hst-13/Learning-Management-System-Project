const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      "learning management system project",
      (err, decodedToken) => {
        if (err) {
          console.log(err.messsage);
          res.redirect("/login");
        } else {
          next();
        }
      }
    );
  } else {
    res.redirect("/login");
  }
};

const loggedIn = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      "learning management system project",
      (err, decodedToken) => {
        if (err) {
          console.log(err.messsage);
          next();
        } else {
          res.redirect("/dashboard");
        }
      }
    );
  } else {
    next();
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      "learning management system project",
      async (err, decodedToken) => {
        if (err) {
          console.log(err.messsage);
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, loggedIn, checkUser };
