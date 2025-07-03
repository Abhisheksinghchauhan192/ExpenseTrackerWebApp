// select the from frome the page. 
let tableForm  = document.getElementById("table-form");
const tablebody = document.getElementById("table-body");

tableForm.addEventListener("submit",(event)=>{

    event.preventDefault();// prevent the default behaviour of the form 

    // extracting data from the form 
    let filter = tableForm.elements.filter.value;
    let top = tableForm.elements.top.value;
    top = parseInt(top);
    let orderby = tableForm.elements.orderby.value;

    // console.log("Table request triggered");
  
     // if topp is selected as all then after parsing it will contain null so 
    // set it to a large value to get all the vaulues of the table.
    if(!top) top = 1000000;
    
    fetch("/home/gettable",{
        method:"POST",
        headers:{
            "Content-Type":'application/json',
        },
        body: JSON.stringify({filter,top,orderby}),
    }).then(response=>{
       return response.json()}
    )
    .then(result=>{

        loadTableData(result.data);

    })

})

function loadTableData(data){

    tablebody.innerHTML = '';
    if(data && data.length>0){

        data.forEach((rec,index,data )=> {
            let row = document.createElement('tr');
            row.insertCell().textContent = index+1;
            row.insertCell().innerText = String(rec.Date).substring(0,10);
            row.insertCell().innerText = `${rec.Amount} ₹`;
            row.insertCell().innerText = rec.Category;
            row.insertCell().innerText = rec.Merchant;
            row.insertCell().innerText = rec.paymentMethod;
            row.insertCell().innerText = rec.Description;
            tablebody.appendChild(row);
            
        });

    }
    // if not data then print no data found in the table 
    else{
        // 8. If no expenses are found, display a "No data" message
        const row = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.textContent = 'No expenses found for the selected criteria.';
        noDataCell.colSpan = 6; // Span across all columns of your table
        noDataCell.style.textAlign = 'center'; // Center the text
        row.appendChild(noDataCell);
        tablebody.appendChild(row);
    }
}




