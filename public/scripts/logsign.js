let logreg = document.querySelector(".logreg-box");
let loginlink = document.querySelector(".login-link");
let reglink = document.querySelector(".register-link");


// to swap with the sign up form 
reglink.addEventListener("click",()=>{

    logreg.classList.add('active');
});

// to swap witht sign form 

loginlink.addEventListener("click",()=>{

    logreg.classList.remove("active");
})


