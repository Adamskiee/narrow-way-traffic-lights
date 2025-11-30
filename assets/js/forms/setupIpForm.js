import { handleFormSubmit } from "../formHandler.js";
import { showFieldError, showFieldSuccess } from "../validate.js";

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
    })
})

handleFormSubmit("insert-ip-form",
    (data)=>(window.location.href = data.redirect),
    (error) => (result.innerText = error.message),
);


document.getElementById("connect-cam-1").addEventListener("click", ()=>checkESP(1));
document.getElementById("connect-cam-2").addEventListener("click", ()=>checkESP(2));