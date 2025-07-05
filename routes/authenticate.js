const express = require("../util/express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10; // Number of salt rounds for hashing
// importing the databse connection.
const connection = require('../database/dbconnection');
//importing the middleware 
const {requireLogin} = require('../middleware/authmiddleware');


// sent the login - signup page to the user.
router.get("/", (req, res) => {
  res.sendFile("loginPage.html", { root: "public/html" });
});


// login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 2. Validate email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.redirect("/?success=false&action=invalidEmail");
  }

  let q = "SELECT email, password FROM users WHERE email = ?";

  try {
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
  } catch (err) {
    return res.redirect("/?success=false&action=databaseError");
  }
});

// setting up the signup logic..

router.post("/signup", async (req, res) => {
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
        console.error("Registration error: \n email already Exits(duplicate email)");

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


// logout route
router.get("/logout",requireLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
    }
    res.redirect("/");
  });
});

module.exports = router;