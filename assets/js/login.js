import { handleFormSubmit } from "./formHandler.js";

handleFormSubmit(
    "loginForm",
    (data) =>  {
        window.location.href = data.redirect
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