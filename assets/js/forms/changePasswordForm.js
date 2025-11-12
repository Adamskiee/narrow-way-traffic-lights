import { handleFormSubmit } from "../formHandler.js";

handleFormSubmit("change-password-form",
    (data)=>document.getElementById("result").innerText=data.message,
    (error)=>document.getElementById("result").innerText=error.message,
    (data)=>{
    if(data["new_password"] !== data["confirm_new_password"]) {
        document.getElementById("result").innerText = "Confirm password is wrong! Please confirm new password";
        return false;
    }
    },
)