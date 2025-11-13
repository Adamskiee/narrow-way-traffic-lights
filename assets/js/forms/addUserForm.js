import { handleFormSubmit } from "../formHandler.js";

handleFormSubmit(
    "user-add", 
    (data)=>document.getElementById("result").innerText=data.message,
    (error)=>document.getElementById("result").innerText=error.message
)

function generatePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, num => charset[num % charset.length]).join('');
}

document.getElementById("generate-btn").addEventListener("click", () => {
    document.getElementById("password").value = generatePassword();
})