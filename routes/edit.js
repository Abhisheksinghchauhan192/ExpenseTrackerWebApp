const express = require("express");
const router = express.Router();

const connection = require("../database/dbconnection");
const {requireLogin} = require("../middleware/authmiddleware");

router.get("/:id",requireLogin,(req,res)=>{
    const id = req.params.id;
    const expense = req.query;

    // formate the Date and pass it as formatted
    let date = '';
    const temp = new Date(expense.date);
    const day = String(temp.getDate()).padStart(2,"0");
    const month = String(temp.getMonth()+1).padStart(2,"0");
    const year = temp.getFullYear();
    date = `${year}-${month}-${day}`;
    expense.date = date;

    res.render("edit.ejs",{id,expense});
});

router.put("/:id",requireLogin,(req,res)=>{
    
    // console.log(req.body);

    let q = `update expenses SET Date = ?,Amount=?,Category = ?,Merchant = ?,paymentMethod = ?,Description = ? where expenseid = ?`;

    let data = [
        req.body.Date,
        req.body.Amount,
        req.body.Category,
        req.body.Merchant,
        req.body.Method,
        req.body.Description,
        req.body.expenseid
    ]
    // put data into db 
    try{
        connection.query(q,data,(err,result)=>{

            if(err) {
                return res.json({msg:"failed"});
            }
            res.json({msg:"success"});
        })
    }catch(err){

        console.log("Error Editing Data in server",err);
        res.json({msg:"failed"});
    }

});


module.exports = router;