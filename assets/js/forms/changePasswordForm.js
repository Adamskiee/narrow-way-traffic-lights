import { handleFormSubmit } from "../formHandler.js";
import { openModal, closeModal } from "../modal.js";
import { openInfoModal, closeInfoModal } from "../infoModal.js";

document.getElementById("change-password-btn").addEventListener("click", () => {
    const modalForm = document.querySelector(".modalForm");
    modalForm.action = "../user/change-password.php";
    modalForm.method = "post";
    modalForm.id = "change-password-form";

    document.getElementById("change-password-form").addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());

        console.log(payload["new_password"], payload["confirm_new_password"])
        if(payload["new_password"] !== payload["confirm_new_password"]) {
            document.getElementById("confirm-password-error-text").innerText = "Password did not match";
            return;
        }
        
        try {
          const response = await fetch(e.target.action, {
            credentials: "include",
            method: e.target.method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    
          const data = await response.json();
          if (data.success) openSuccessModal(data.message)
          else {
            document.getElementById("current-password-error-text").innerText = "Current password is wrong";
            }
        } catch (err) {
          openErrorModal(err.message)
        }
    });

    openChangePasswordModal();
})

function openChangePasswordModal() {
    fetch("../")
    openModal({
        title: "Change Password",
        body: `
        <div class="mb-3">
            <label for="currentPassword" class="form-label">Current Password*</label>
            <input
                type="password"
                class="form-control"
                name="current_password"
                id="currentPassword"
                required
            />
            <span class="form-text text-danger" id="current-password-error-text"></span>
            </div>
        <div class="mb-3">
            <label for="newPassword" class="form-label">New Password*</label>
            <input
            type="password"
            class="form-control"
            name="new_password"
            id="newPassword"
            required
            />
            <span class="form-text text-danger" id="new-password-error-text"></span>
        </div>
        <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password*</label>
            <input
                type="password"
                class="form-control"
                name="confirm_new_password"
                id="confirmPassword"
                required
            />
            <span class="form-text text-danger" id="confirm-password-error-text"></span>
        </div>
        `,
        footer: `
        <button type="submit" class="btn btn-primary">Change Password</button>
        `
    });
}


function openSuccessModal(message) {
    closeModal();

    openInfoModal({
        title: "Success",
        body: `<p>${message}</p>`,
        footer: `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    })

    setTimeout(() => {
        closeInfoModal();
        location.reload();
    }, 1000);
}

function openErrorModal(message, close=true) {
    if(close) closeModal();

    openInfoModal({
        title: "Error",
        body: `<p>${message}</p>`,
        footer: `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    })

    setTimeout(() => {
        closeInfoModal();
        if(close) location.reload();
    }, 3000);
}