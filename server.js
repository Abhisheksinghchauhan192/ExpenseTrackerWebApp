const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Number of salt rounds for hashing
const session = require("express-session");

app.use(session({
    secret: 'verySecretKey', // Change this to something secure in production
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour session
}));

const connection = mysql.createConnection({
  host: "localhost",
  user: "TestUser",
  password: "Mysql@123",
  database: "etest",
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.listen(3000, () => {
  console.log("Expense Tracker App Engine Started");
});

// sent the login - signup page to the user.
app.get("/", (req, res) => {
  res.sendFile("loginPage.html", { root: "public/html" });
});

// setting up the login logic..
// definig a middle ware for route protection . 

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/?success=false&action=unauthorized");
    }
    next();
}

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 2. Validate email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.redirect("/?success=false&action=invalidEmail");
  }

  let q = "SELECT email, password FROM users WHERE email = ?";
  connection.query(q, [email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.redirect("/?success=false&action=databaseError");
    }

    // Check if user exists
    if (result.length === 0) {
      return res.redirect("/?success=false&action=userNotExists");
    }

    const user = result[0];

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.redirect("/?success=false&action=databaseError");
      }

      if (isMatch) {
        //  Store user session
        req.session.user = { email: user.email };
        return res.redirect("/home?success=true&action=loggedIn");
      } else {
        // Passwords do not match
        return res.redirect("/?success=false&action=wrongPassword");
      }
    });
  });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error destroying session:", err);
        }
        res.redirect("/");
    });
});

// function to get the data for the charts 
function getTotalExpense(){
  return new Promise((resolve,reject)=>{

    const q = `select sum(Amount) as total from expenses`;
    connection.query(q,(err,result)=>{

      if(err)reject(err);
      resolve(result[0].total);
    });
  });
}

function getExpensesByCategory(){
  return new Promise((resolve,reject)=>{

    const q = `select Category,sum(Amount) as total from expenses group by Category`;
    connection.query(q,(err,result)=>{

      if(err)reject(err);
      resolve(result);
    });
  });
}


app.get("/home",requireLogin,async(req, res) => {
  // logic to get the data from the database...
  // let me figure out the steps..
  let userEmail = req.session.user.email;

  try{
    let totalExpense = await getTotalExpense();
    let byCategoryResult = await getExpensesByCategory();
    res.render("home.ejs",{

      total:totalExpense || 0,
      byCategory:byCategoryResult,
      user:req.session.user
    });

  }catch(err){
    res.status(500).send("An error occurred while fetching your data.");
  }
    
});

// setting up the signup logic..

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Input validation
    if (!name || !email || !password) {
      return res.redirect("/?success=false&action=missingFields");
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Store in database
    const data = [email, name, hashedPassword];
    const q = "INSERT INTO users (email, name, password) VALUES (?)";

    connection.query(q, [data], (err, result) => {
      if (err) {
        console.error("Registration error:", err);

        // Handle duplicate email case
        if (err.code === "ER_DUP_ENTRY") {
          return res.redirect("/?success=false&action=emailExists");
        }

        return res.redirect("/?success=false&action=error");
      }

      console.log("Successfully registered user:", email);
      res.redirect("/?success=true&action=created");
    });
  } catch (err) {
    console.error("Error in signup process:", err);
    res.redirect("/?success=false&action=error");
  }
});
