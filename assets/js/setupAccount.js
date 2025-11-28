import { handleFormSubmit } from "./formHandler.js";

handleFormSubmit(
    "setupForm",
    (data) =>  {
        window.location.href = data.redirect
    },
    (error) => {
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