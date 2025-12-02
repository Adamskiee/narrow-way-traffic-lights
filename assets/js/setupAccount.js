import { handleFormSubmit } from "./formHandler.js";
import { setupRealtimeValidation, validateForm } from "./validate.js";
import { initPasswordToggles } from "./password-toggle.js";


const setupForm = document.getElementById('setupForm');
if(setupForm) {
    setupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const validate = validateForm(setupForm);
        if(!validate.isValid) {
            return;
        }

        const formData = new FormData(setupForm);
        const payload = Object.fromEntries(formData.entries());
        try {
            const response = await fetch("./includes/setup-process.php", {
                credentials: 'include',
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.success) window.location.href = data.redirect
            else document.getElementById("result").innerText = data.message;
        } catch (err) {
        document.getElementById("result").innerText = err.message;
        console.log(err);
        }
  });

  setupRealtimeValidation(setupForm);
}

document.querySelectorAll(".form-control").forEach(input => {
    input.addEventListener("input", () => {
        if(document.getElementById("result").innerText !== "") {
            document.getElementById("result").innerText = 
        "";
        }
    })
})


document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
})