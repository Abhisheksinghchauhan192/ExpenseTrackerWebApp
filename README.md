# 💸 Expense Tracker & Analyzer Web App

A modern, responsive **personal expense management** and visualization web application 🧾📊  
Helps users **track**, **analyze**, and **optimize** their spending habits in one simple dashboard.

> Built with 💻 **Node.js**, **Express**, **MySQL**, **Vanilla JS**, and **Bootstrap**.

---


## ✨ Features

✅ User Authentication (SignUp/Login) with password hashing  
📅 Add, Edit & Delete Expenses  
📊 Pie Chart for Category-wise Spending  
📆 Monthly Bar Chart for Expense Trend  
🔎 Filterable Expense Table  
🏆 Insights on Top 3 Categories & Merchants  
🧮 Total Monthly Expense Display

---

## 🛠️ Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Frontend    | HTML, CSS, JavaScript, Bootstrap |
| Backend     | Node.js, Express.js              |
| View Engine | EJS                              |
| Database    | MySQL                            |
| Auth        | express Session    |

---

## 📁 Folder Structure


  .
  ├── database/ # MySQL connection config
  
  ├── middleware/ # Custom middleware
  
  ├── public/
  
  │ ├── assets/ # Images, logos
  
  │ ├── css/ # Stylesheets
  
  │ └── scripts/ # Frontend JS
  
  ├── routes/ # Route handlers
  
  ├── views/ # EJS templates
  
  ├── util/ # Utilities 
  
  ├── server.js # Entry point
  
  ├── package.json # Dependencies
  
  └── README.md


---

## 🧾 MySQL Database Schema


### 🚀 Getting Started
#### 🧑‍💻 Prerequisites

    ✔️ Node.js (v14 or above) 
    ✔️ MySQL Server 
  
### 🔄 1. Clone the Repository

    git clone https://github.com/Abhisheksinghchauhan192/ExpenseTrackerWebApp
    
    Go inside Repo 

### 📦 2. Install Node Dependencies

    npm install

### 🛠️ 3. Set Up Your Database

    Open MySQL and create a new database.

    Run the SQL statements provided inside Schema

    Update your MySQL credentials in the config file:

### Make a .env file in the root 
      you need to make a .env config file in the root cotaining 
      port info 
      database info like password DbName and user 
      
#### 🧪 Sample .env File (Optional)

      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=password
      DB_NAME=expense_db
      PORT=3000

### 🟢 4. Start the Server

    node server.js

Your app will now run at:
🔗 http://localhost:3000

---

## 🖱️ How to Use
### ✅ Step 1: Sign Up or Log In

    Go to the root page (/)

    Create a new account or use existing credentials

### 📊 Step 2: View Your Dashboard

    A responsive dashboard will load after login.

    Top section includes:

        🔍 Filterable expense table

        📈 Category Pie Chart

        🧮 Total Monthly Expense

        📆 Monthly Bar Chart (select a month)

### ✏️ Step 3: Add / Edit / Delete Expenses

    Click Add Expense to insert a new one.

    Use Edit or Delete on any row in the table to update.

### 🏆 Step 4: Analyze Insights

    Bottom section shows:

        🏅 Top 3 Spending Categories (this month)

        🛍️ Top 3 Merchants where money was spent

Use this data to review your spending behavior.


## 🤝 Contribution

### Contributions are welcome! 🚀
#### To contribute:

    Fork this repo

    Create a new branch (git checkout -b feature-name)

    Make your changes

    Commit and push (git commit -m "Added feature X")

    Open a pull request

## 👨‍💻 Author

### Abhishek Singh Chauhan
📧 chauhanavi667@gmail.com
🐙 [GitHub](https://github.com/Abhisheksinghchauhan192/ExpenseTrackerWebApp)
🔗 [LinkedIn](www.linkedin.com/in/abhisheksinghchauhan786)
