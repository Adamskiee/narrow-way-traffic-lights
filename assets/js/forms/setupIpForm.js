import { handleFormSubmit } from "../formHandler.js";
import { clearFieldError, showFieldError, showFieldSuccess, validateForm } from "../validate.js";
import { setupRealtimeValidation } from "../validate.js";

const result = document.getElementById("ip-result");
const weekDays = document.getElementById("week-days");
const ipRegex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const inputs = document.querySelectorAll(".ip-input");

export async function checkESP(num) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);
    const result = document.getElementById(`result_cam_${num}`);
    const ipInput = document.querySelector(`input[name="ip_address_cam_${num}"]`);
    const ip = ipInput.value;

    if(!ipRegex.test(ip.trim())) {
        showFieldError(ipInput, "Invalid IP address");
        return false;
    }

    showFieldError(ipInput, "Loading...");
    try {
        const res = await fetch(`http://${ip}/check`, { method: "GET", mode: "no-cors", signal: controller.signal });
        clearTimeout(id);
        showFieldError(ipInput, "Reachable");
        return true;
    }catch(err) {
        showFieldError(ipInput, "Unreachable");
        return false;
    }
}

inputs.forEach(input => {
    input.addEventListener("input", (e) => {
        const camNum = e.target.dataset.cam;

        document.getElementById(`result_cam_${camNum}`).innerText = "";
        clearFieldError(input)
    })
})
const insertIpForm = document.getElementById("insert-ip-form")

if(insertIpForm) {
    insertIpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const validate = validateForm(insertIpForm);
        if(!validate.isValid) {
            return;
        }

        const formData = new FormData(insertIpForm);
        const payload = Object.fromEntries(formData.entries());
        try {
            const response = await fetch("../admin/insert-ip.php", {
            credentials: 'include',
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.success) window.location.href = data.redirect
            else {
                document.getElementById("result").innerText = data.message
                if(data.redirect) {
                    window.location.href = data.redirect
                }
            }
        } catch (err) {
            document.getElementById("result").innerText = err.message
            console.log(err);
        }
    });
    setupRealtimeValidation(insertIpForm);
}

const skipBtn = document.getElementById('skip-ip-btn');
if(skipBtn){
    skipBtn.addEventListener("click", ()=> {
        window.location.href = "./control.php";
    })
}


document.getElementById("connect-cam-1").addEventListener("click", ()=>checkESP(1));
document.getElementById("connect-cam-2").addEventListener("click", ()=>checkESP(2));