const express = require("../util/express");
const router = express.Router();
// importing the databse connection.
const connection = require('../database/dbconnection');
const {requireLogin} = require('../middleware/authmiddleware');

// function to get the data for the charts
function getTotalExpense() {
  return new Promise((resolve, reject) => {
    const q = `select sum(Amount) as total from expenses`;
    connection.query(q, (err, result) => {
      if (err) reject(err);
      resolve(result[0].total);
    });
  });
}

function getExpensesByCategory() {
  return new Promise((resolve, reject) => {
    const q = `select Category,sum(Amount) as total from expenses group by Category`;
    connection.query(q, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

function getCurrentMonthData() {
  return new Promise((resolve, reject) => {
    const q = `(SELECT
    'category' AS type,
    Category AS name,
    SUM(Amount) AS total_spent
FROM
    expenses
WHERE
    DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
GROUP BY
    Category
ORDER BY
    total_spent DESC
LIMIT 3)

UNION ALL

(SELECT
    'merchant' AS type,
    Merchant AS name,
    SUM(Amount) AS total_spent
FROM
    expenses
WHERE
    DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
GROUP BY
    Merchant
ORDER BY
    total_spent DESC
LIMIT 3);`;

    connection.query(q, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

router.get("/", requireLogin, async (req, res) => {
  // logic to get the data from the database...
  // let me figure out the steps..
  let userEmail = req.session.user.email;

  try {
    let totalExpense = await getTotalExpense();
    let byCategoryResult = await getExpensesByCategory();
    let currentData = await getCurrentMonthData();
    // filterout the data of the current month
    let top3Category = [];
    let top3Merchant = [];
    for (let item of currentData) {
      if (item.type === "category") {
        top3Category.push(item);
      } else {
        top3Merchant.push(item);
      }
    }
    res.render("home.ejs", {
      total: totalExpense || 0,
      byCategory: byCategoryResult,
      user: req.session.user,
      top3cat: top3Category,
      top3merchant: top3Merchant,
    });
  } catch (err) {
    res.status(500).send("An error occurred while fetching your data.");
  }
});

module.exports = router;