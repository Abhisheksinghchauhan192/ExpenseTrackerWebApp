const express = require("express")
const router = express.Router();
// database connection 
const connection = require("../database/dbconnection");
// middle ware for securing route. 
const {requireLogin} = require("../middleware/authmiddleware");
const {Parser} = require("json2csv");
const ExcelJs = require("exceljs");
const PdfDocument = require("pdfkit");

const getData = ()=>{

    return new Promise((resolve,reject)=>{

        const q = `select * from expenses`;
        connection.query(q,(err,result)=>{
            if(err)reject(err);
            resolve(result);
        });
    });
};


// csv export 
router.get("/csv",requireLogin,async (req,res)=>{

    const expenses = await getData();
    // console.log(expenses);
    const fields = ["Id","Date","Amount","Category","Merchant","paymentMethod","Description"];
    const parser = new Parser({fields});
    const csv = parser.parse(expenses);

    res.header('Content-Type','text/csv');
    res.attachment('expenses.csv');

    return res.send(csv);

});

// pdf exports 
router.get("/pdf", requireLogin, async (req, res) => {

  const expenses = await getData(); 

  const doc = new PdfDocument({ margin: 40, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=expenses.pdf');

  doc.pipe(res);

  // ✅ Title
  doc.fontSize(20).fillColor('#333').text("Expense Data Report", { align: "center" });
  doc.moveDown(1.5);

  // ✅ Table Column Headers
  const tableTop = 100;
  const rowHeight = 25;
  const columnPositions = {
    date: 40,
    amount: 100,
    category: 170,
    merchant: 270,
    method: 380,
    description: 490
  };

  // Draw header background
  doc.rect(40, tableTop, 520, rowHeight).fill('#e0e0e0');
  doc.fillColor('#000').fontSize(12).font('Helvetica-Bold');

  doc.text('Date', columnPositions.date, tableTop + 7);
  doc.text('Amount (₹)', columnPositions.amount, tableTop + 7);
  doc.text('Category', columnPositions.category, tableTop + 7);
  doc.text('Merchant', columnPositions.merchant, tableTop + 7);
  doc.text('Method', columnPositions.method, tableTop + 7);
  doc.text('Description', columnPositions.description, tableTop + 7, { width: 100 });

  // ✅ Start adding rows
  let y = tableTop + rowHeight;
  doc.font('Helvetica').fontSize(10);

  expenses.forEach((exp, index) => {
    if (y > 750) {
      doc.addPage();
      y = 50;
    }

    // Convert ISO date to DD/MM/YYYY
    const iso = new Date(exp.Date);
    const day = String(iso.getDate()).padStart(2, '0');
    const month = String(iso.getMonth() + 1).padStart(2, '0');
    const year = iso.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Zebra row background
    if (index % 2 === 0) {
      doc.rect(40, y, 520, rowHeight).fill('#f9f9f9').fillColor('#000');
    }

    // Write data to columns
    doc.text(formattedDate, columnPositions.date, y + 7);
    doc.text(exp.Amount.toFixed(2), columnPositions.amount, y + 7);
    doc.text(exp.Category, columnPositions.category, y + 7);
    doc.text(exp.Merchant, columnPositions.merchant, y + 7);
    doc.text(exp.paymentMethod, columnPositions.method, y + 7);
    doc.text(exp.Description, columnPositions.description, y + 7, { width: 100 });

    y += rowHeight;
  });

  doc.end();
});

// excel sheet exports
router.get("/excel",requireLogin,async (req,res)=>{

    const expenses = await getData();

    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");

    worksheet.columns = [
        {header:"Expense ID",key:"expenseid"},
        {header:"Date",key:"Date"},
        {header:"Amount",key:"Amount"},
        {header:"Category",key:"Category"},
        {header:"Merchant",key:"Merchant"},
        {header:"Payment Method",key:"paymentMethod"},
        {header:"Description",key:"Description"}
    ]

    // add each expense to the worksheet 
    expenses.forEach(exp=>{
        worksheet.addRow(exp)
    });

    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.setHeader('Content-Disposition','attachment;filename=expenses.xlsx');

    await workbook.xlsx.write(res);
    res.end();

});



module.exports = router;