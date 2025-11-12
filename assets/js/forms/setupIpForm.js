import { handleFormSubmit } from "../formHandler.js";

const result = document.getElementById("ip-result");

handleFormSubmit("setup-ip-form",
    (data)=>(window.location.href = data.redirect),
    (error) => (result.innerText = error.message),
    (data) => {
        fetch(`http://${data["ip_address_cam"]}/check`, { method: "GET", mode: "no-cors" })
        .then(res => {
            // Handle response here
            result.innerText = `✅ ESP${index} (${ip}) is reachable.`;
            return true;
        })
        .catch(error => {
            // Handle errors here
            result.innerText = `❌ ESP${index} (${ip}) not reachable.`;
            return false;
        });
    }
);