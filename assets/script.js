const ESP32_IP = "10.42.0.76";

async function toggleLED(led, state) {
    let url = `http://${ESP32_IP}`;
    console.log("toogl");
    if(led === "green") {
        url += state ? "/led_green_on" : "/led_green_off";
    }else if(led === "red") {
        url += state ? "/led_red_on": "/led_red_off";
    }
    console.log(url);
    await fetch(url)
        .then(res => res.text())
        .then(data => {
            document.getElementById("result").innerText = data;
        })
        .catch(err => {
            console.error(err);
        });
}
