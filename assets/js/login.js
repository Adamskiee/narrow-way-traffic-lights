import { handleFormSubmit } from "./formHandler.js";

handleFormSubmit(
    "loginForm",
    (data) =>  {
        
        if (data.token) {
            localStorage.setItem('jwt_token', data.token);
        }
        console.log(data.redirect);
        
        if(data.redirect) window.location.href = data.redirect
        else {
            document.getElementById("insert-ip-form").classList.remove("hidden")
            document.getElementById("loginForm").classList.add("hidden")
        }
    },
    (error) => {
        document.querySelector('.form-control[type="password"]').value="";
        document.getElementById("result").innerText = error.message;
    }
);

document.querySelectorAll(".form-control").forEach(input => {
    input.addEventListener("input", () => {
        if(document.getElementById("result").innerText !== "") {
            document.getElementById("result").innerText = 
        "";
        }
    })
})