import { handleFormSubmit } from "./formHandler.js";
import { setupRealtimeValidation, validateForm } from "./validate.js";
import { initPasswordToggles } from "./password-toggle.js";
import { openInfoModal, closeInfoModal } from "./infoModal.js";


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
            if (data.success) {
                openInfoModal({
                    title: "Success",
                    body: `
                        <div class="text-center">
                            <i class="fas fa-check-circle text-success fa-3x mb-3"></i>
                            <p class="mb-0">${data.message}</p>
                        </div>
                    `,
                    footer: `<button type="button" class="btn btn-success" id="closeSuccessModal">Close</button>`
                });
            
                setTimeout(() => {
                    const closeBtn = document.getElementById('closeSuccessModal');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => {
                            closeInfoModal();
                        });
                    }
                }, 100);
                
                setTimeout(() => {
                    closeInfoModal();
                }, 1500);
                setTimeout(() => {
                    window.location.href = data.redirect
                }, 2000);
            }
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