// select the from frome the page.
let tableForm = document.getElementById("table-form");
const tablebody = document.getElementById("table-body");
let tableData = [];

document.addEventListener("DOMContentLoaded", () => {
  const selectElements = document.querySelectorAll(".selectfilters"); // Note the dot for class selector

  selectElements.forEach((selectElement) => {
    selectElement.value = "";
  });
});

tableForm.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent the default behaviour of the form

  // extracting data from the form
  let filter = tableForm.elements.filter.value;
  let top = tableForm.elements.top.value;
  top = parseInt(top);
  let orderby = tableForm.elements.orderby.value;

  // console.log("Table request triggered");

  // if topp is selected as all then after parsing it will contain null so
  // set it to a large value to get all the vaulues of the table.
  if (!top) top = 100000000;

  fetch("/home/gettable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filter, top, orderby }),
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      tableData = result.data;
      loadTableData(result.data);
    });
});

// functions for table filters after fetched from the DB.
// getting the data from the filters .
const selectedMonth = document.getElementById("monthfilter");
const selectedYear = document.getElementById("yearfilter");
const selectedCat = document.getElementById("catfilter");
const selectedPayment = document.getElementById("PaymentMethodfilter");
// adding event on filters.
[selectedCat, selectedMonth, selectedYear, selectedPayment].forEach((ele) => {
  ele.addEventListener("change", () => {
    applyFilters();
  });
});

// filtering function
function applyFilters() {
  const monthValue = selectedMonth.value
    ? selectedMonth.value.padStart(2, "0")
    : "";
  const yearValue = selectedYear.value;
  const catValue = selectedCat.value;
  const methodValue = selectedPayment.value;



  const filteredData = tableData.filter((exp) => {
    const expDate = new Date(exp.Date);
    const expMonth = (expDate.getMonth() + 1).toString().padStart(2, "0");
    const expYear = expDate.getFullYear().toString();

    // Lowercase handling to prevent mismatch due to casing
    const category = exp.Category?.toLowerCase() || "";
    const payment = exp.paymentMethod?.toLowerCase() || "";

    const matchMonth = !monthValue || monthValue === expMonth;
    const matchYear = !yearValue || yearValue === expYear;
    const matchCat = !catValue || catValue.toLowerCase() === category;
    const matchMethod = !methodValue || methodValue.toLowerCase() === payment;

    const include = matchMonth && matchYear && matchCat && matchMethod;

    return include;
  });

  loadTableData(filteredData);
}


function loadTableData(data) {
  tablebody.innerHTML = "";
  let total = 0;
  if (data && data.length > 0) {
    data.forEach((rec, index, data) => {
      let row = document.createElement("tr");
      row.insertCell().textContent = index + 1;
      // converting the date into dd/mm/yyyy format
      const date = new Date(rec.Date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = date.getFullYear();
      row.insertCell().innerText = `${day}/${month}/${year}`;

      row.insertCell().innerText = `${rec.Amount} ₹`;
      total += rec.Amount;
      row.insertCell().innerText = rec.Category;
      row.insertCell().innerText = rec.Merchant;
      row.insertCell().innerText = rec.paymentMethod;
      // creating the descriptiono td with editable 
      const tdesc = document.createElement("td");
      tdesc.id  = "descEdit";
      // adding the current Expense id to the classname
      tdesc.classList.add(`${rec.expenseid}`);
      tdesc.innerHTML = `<a href="/home/expenses/${rec.expenseid}?date=${rec.Date}&amount=${rec.Amount}&cat=${rec.Category}&merc=${rec.Merchant}&method=${rec.paymentMethod}&desc=${rec.Description}">${rec.Description}</a>`;   
      row.appendChild(tdesc);
      tablebody.appendChild(row);
    });

    // adding total amount in the last
    let row = document.createElement('tr');
    row.insertCell().textContent = "";
    row.insertCell().innerText = "Total ";
    row.insertCell().innerText = `${total} ₹`;
    tablebody.appendChild(row);

  }
  // if not data then print no data found in the table
  else {
    // 8. If no expenses are found, display a "No data" message
    const row = document.createElement("tr");
    const noDataCell = document.createElement("td");
    noDataCell.textContent = "No expenses found for the selected criteria.";
    noDataCell.colSpan = 6; // Span across all columns of your table
    noDataCell.style.textAlign = "center"; // Center the text
    row.appendChild(noDataCell);
    tablebody.appendChild(row);
  }
}
