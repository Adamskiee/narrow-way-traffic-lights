const cams = {
  cam1: {
    ip: "",  
    ws: null,
    connected: false
  },
  cam2: {
    ip: "",   
    ws: null,
    connected: false
  }
};

function connectWebSocket(camName) {
  const cam = cams[camName];
  const wsURL = "ws://" + cam.ip + "/ws";

  console.log(`Connecting WS for ${camName}: ${wsURL}`);

  cam.ws = new WebSocket(wsURL);

  cam.ws.onopen = () => {
    cam.connected = true;
    updateStatus(camName, true);
    console.log(`${camName} WebSocket connected`);
  };

  cam.ws.onmessage = (e) => {
    console.log(`${camName} says:`, e.data);
  };

  cam.ws.onerror = () => {
    console.log(`${camName} WebSocket error`);
  };

  cam.ws.onclose = () => {
    cam.connected = false;
    updateStatus(camName, false);
    console.log(`${camName} WS closed — retrying in 2s`);
    setTimeout(() => connectWebSocket(camName), 2000);
  };
}

function sendLED(camName, cmd) {
  const cam = cams[camName];
  if (cam.connected && cam.ws.readyState === WebSocket.OPEN) {
    cam.ws.send(cmd);
    console.log(`Sent to ${camName}: ${cmd}`);
  } else {
    alert(camName + " is not connected.");
  }
}

function updateStatus(camName, online) {
  const el = document.getElementById(camName + "-status");
  el.innerText = online ? "ONLINE" : "OFFLINE";
  el.style.color = online ? "green" : "red";
}


document.addEventListener("DOMContentLoaded", ()=> {
  fetch("../user/get-ip.php")
    .then(res => res.json())
    .then(data => {
      const {ip_address_1, ip_address_2} = data["ip_addresses"]
      cams.cam1.ip = ip_address_1;
      cams.cam2.ip = ip_address_2;
      
      document.getElementById("cam1").src = "http://" + cams.cam1.ip + "/stream";
      document.getElementById("cam2").src = "http://" + cams.cam2.ip + "/stream";
    
      connectWebSocket("cam1");
      connectWebSocket("cam2");
    })
    .catch(err => {
      console.log(err)
    })
})