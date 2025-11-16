import { handleFormSubmit } from "../formHandler.js";

const result = document.getElementById("ip-result");
console.log(result);

const ipRegex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

export async function checkESP(num) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);
    const result = document.getElementById(`result_cam_${num}`);
    const ip = document.querySelector(`input[name="ip_address_cam_${num}"]`).value;

    if(!ipRegex.test(ip.trim())) {
        result.innerText = "Invalid IP address"
        return false;
    }

    result.innerText = "Loading...";
    try {
        const res = await fetch(`http://${ip}/check`, { method: "GET", mode: "no-cors", signal: controller.signal });
        clearTimeout(id);
        result.innerText = "Reachable";
        return true;
    }catch(err) {
        result.innerText = "Unreachable";
        return false;
    }
}

handleFormSubmit("insert-ip-form",
    (data)=>(window.location.href = data.redirect),
    (error) => (result.innerText = error.message),
    async (data) => {
        const valid = [];
        for (let i = 1; i <= 2; i++) {
            const validIP = await checkESP(i);
            if(!validIP) {
                valid.push(false);
            }            
        }
        valid.forEach(v => {if(!v) return false;})
        return true;
    }
);

handleFormSubmit("change-ip-form",
    (data)=>(result.innerText = data.message),
    (error) => (result.innerText = error.message),
    async (data) => {
        const valid = [];
        for (let i = 1; i <= 2; i++) {
            const validIP = await checkESP(i);
            if(!validIP) {
                valid.push(false);
            }            
        }
        valid.forEach(v => {if(!v) return false;})
        return true;
    }
);

document.getElementById("connect-cam-1").addEventListener("click", ()=>checkESP(1));

document.getElementById("connect-cam-2").addEventListener("click", ()=>checkESP(2));
