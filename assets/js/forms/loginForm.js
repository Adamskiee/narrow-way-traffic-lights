import { handleFormSubmit } from "../formHandler.js";

handleFormSubmit(
  "loginForm",
  (data) => (window.location.href = data.redirect),
  (error) => (document.getElementById("result").innerText = error.message)
);
