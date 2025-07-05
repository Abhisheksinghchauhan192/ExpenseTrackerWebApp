const express = require("./util/express");
const path = require("path");
const app = express();
const {sessionmiddleware} = require("./middleware/authmiddleware");

// requiring the routes.. 
const authenticateRoute = require("./routes/authenticate");
const homeRoute = require('./routes/home');
const monthlyexpenseRoute  = require('./routes/monthlyexpenses');
const tabledataRoute = require("./routes/tabledata");
const addRoute = require('./routes/add');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionmiddleware);
app.use(express.static(path.join(__dirname, "/public")));

// setting the authentication and login routes

app.use('/home/getmonthly',monthlyexpenseRoute);
app.use('/home/gettable',tabledataRoute);
app.use('/home/add',addRoute);
app.use("/home",homeRoute);
app.use("/",authenticateRoute);


app.listen(3000, () => {
  console.log("Expense Tracker App Engine Started");
});

// adding a router for the page requested which is not found then render the page not 
// found file 

app.use("/",(req,res)=>{
  res.sendFile("pageNotFound.html", { root: "public/html" });
})
