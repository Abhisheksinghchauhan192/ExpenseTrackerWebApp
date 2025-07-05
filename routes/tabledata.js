const express = require("../util/express");
const router = express.Router();
// importing the databse connection.
const connection = require('../database/dbconnection');
const {requireLogin} = require('../middleware/authmiddleware');

// setting the route to show the path gettingTable Data..
router.post("/", requireLogin, (req, res) => {
  let q = `select * from expenses `;
  let { filter, top, orderby } = req.body;
  // query building logic  ..
  orderby = orderby === "asc" ? "asc" : "desc";

  if (filter === "Filter") {
    q += ` order by Amount ${orderby} limit ?`;
  }

  connection.query(q, [top], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({
          success: false,
          message: "Database error while fetching expenses.",
        });
    res.json({ success: true, data: result });
  });
});

module.exports = router;