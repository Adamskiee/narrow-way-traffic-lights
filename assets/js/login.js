import { handleFormSubmit } from "./formHandler.js";
import { initPasswordToggles } from "./password-toggle.js";

handleFormSubmit(
    "loginForm",
    (data) =>  {
        
        if (data.token) {
            localStorage.setItem('jwt_token', data.token);
        }
        
        localStorage.clear();
        if(data.redirect) window.location.href = data.redirect
        else {
            document.getElementById("insert-ip-form").classList.remove("hidden")
            document.getElementById("loginForm").classList.add("hidden")
        }
    },
    (error) => {
        document.getElementById('password').value="";
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

document.addEventListener("DOMContentLoaded", () => {
    initPasswordToggles();
})