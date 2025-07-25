const savebtn = document.getElementById("savebtn");

savebtn.addEventListener("click",(event)=>{
    try{
        event.preventDefault();
        sendFormData();
    }
    catch{
        console.error("Error Sending Data ");
    }
});


function sendFormData(){
    let id = document.getElementById("exp-id").classList[0];
    id = parseInt(id);
    const date = document.getElementById("date-box").value;
    console.log(date,"this is the date");
    let amount = document.getElementById("exp-amount").value;
    amount = parseFloat(amount);
    const category = document.getElementById("category").value;
    const merchant = document.getElementById("exp-merchant").value;
    const method = document.getElementById("pay").value;
    const description = document.getElementById("desc").value;
    console.log(description);


    fetch(`/home/expenses/${id}`,{

        method:"PUT",
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify({expenseid:id,Date:date,Amount:amount,Category:category,Merchant:merchant,Method:method,Description:description}), 
    })
    .then(res =>res.json())
    .then(data=>{
        if(data.msg === 
            'success'
        ){

            window.location.href="/home/expenses/t?success=true&action=dataEdited";
        }
        else{
            window.location.href="/home/expenses/f?success=false?action=databaseError";
        }
    })
    .catch((err)=>{
        console.error("Some Error Occurred Request Not Submitted");
        window.location.href="/home/expenses/f?success=false&action=databaseError";

    })

}

