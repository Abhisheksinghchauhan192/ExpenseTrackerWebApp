const express = require("../util/express");
const router = express.Router();
// importing the databse connection.
const connection = require('../database/dbconnection');
const {requireLogin} = require('../middleware/authmiddleware');
//route for getting monthly data

router.post("/", requireLogin, (req, res) => {
  // getting data from the database based on the month and year..
  // console.log(req.body);

  let q = `
      select
	
	      if(grouping(Category),
		      'Total',Category) category,
	      sum(Amount) totalPerMonth
      from 
	      expenses
    `;

  let { year, month } = req.body;
  year = parseInt(year);
  month = parseInt(month);

  q += `where year(Date) = ? and month(Date) = ? group by category with rollup`;

  connection.query(q, [year, month], (err, results) => {
    if (err) res.redirect("/home?success=false&action=databaseError");
    // console.log(results);
    res.json(results);
  });
});

module.exports = router