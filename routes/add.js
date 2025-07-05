const express = require("../util/express");
const router = express.Router();
// importing the databse connection.
const connection = require('../database/dbconnection');
const {requireLogin} = require('../middleware/authmiddleware');

// settin up the add route.
router.get("/", requireLogin, (req, res) => {
  res.render("add.ejs");
});

// getting the data from tehh add route

router.post("/", requireLogin, (req, res) => {
  // making the logic of adding the new expense in the databasee..

  let q =
    "insert into expenses(Date,Amount,Category,Merchant,paymentMethod,Description) values (?)";

  let { Date, Amount, Category, Merchant, paymentMethod, Description } =
    req.body;

  Amount = parseFloat(Amount);
  //handeling invalid Amounts....
  if (isNaN(Amount) || Amount < 0) {
    return res.redirect("/home/add?success=false&action=inputError");
  }

  Merchant = Merchant.replace(/\b\w/g, (char) => char.toUpperCase());
  const data = [Date, Amount, Category, Merchant, paymentMethod, Description];

  // making request to the database now.
  try {
    connection.query(q, [data], (err, result) => {
      if (err) res.redirect("/home/add?success=false&action=databaseError");
      res.redirect("/home/add?success=true&action=dataAdded");
    });
  } catch (err) {
    console.log("error in database connection");
    res.redirect("/home/add?success=false&action=databaseError");
  }
});

module.exports = router;