
const session = require("express-session");
require('dotenv').config();

// definig a middle ware for route protection .
const sessionmiddleware = 
  session({
    secret: process.env.SESSION_SECRET, // Change this to something secure in production
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour session
  });


function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/?success=false&action=unauthorized");
  }
  next();
}

module.exports = {
    requireLogin,
    sessionmiddleware,
};