let logreg = document.querySelector(".logreg-box");
let loginlink = document.querySelector(".login-link");
let reglink = document.querySelector(".register-link");
let loginForm = document.querySelector(".form-box.login");
let registerForm = document.querySelector(".form-box.register");

// to swap with the sign up form 
reglink.addEventListener("click", () => {
    logreg.classList.add('active');
    loginForm.style.display = "none"; // Hide login form
    registerForm.style.display = "flex"; // Show register form
});

// to swap with the sign in form 
loginlink.addEventListener("click", () => {
    logreg.classList.remove("active");
    loginForm.style.display = "flex"; // Show login form
    registerForm.style.display = "none"; // Hide register form
});

// Initialize the forms
loginForm.style.display = "flex"; // Show login form by default
registerForm.style.display = "none"; // Hide register form by default


// typewriter effect... 

let typewriterobj = document.querySelector("#typewriter");
const msg = "Your Expense Tracker";

let charIndex = 0;
function typewriter(){

    if(charIndex<msg.length){
        typewriterobj.textContent += msg.charAt( charIndex);
        charIndex++;
        setTimeout(typewriter,100);
    }else{
        //delat before erasing the msg..
        setTimeout(eraseText,1500);
    }

}

function eraseText(){
    if(charIndex>0){
        typewriterobj.textContent = msg.substring(0,charIndex-1);
        charIndex--;
        // adjust the erasing speed of the text
        setTimeout(eraseText,50);
    }else{
        //delay before typing again
        setTimeout(typewriter,500);
    }
}

// calling the typewriter function 
typewriter();