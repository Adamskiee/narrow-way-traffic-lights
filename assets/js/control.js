import { handleFormSubmit } from "./formHandler.js";

const startButton = document.getElementById("start-traffic-light");
const weekDays = document.getElementById("week-days");
const weekDayDurationEdit = document.getElementById("weekday-duration-edit");
const weekDayDurationAdd = document.getElementById("weekday-duration-add");
const durationFormAdd = document.getElementById("add-weekday-form");
const durationFormEdit = document.getElementById("edit-weekday-form");
const weekDayAdd = document.getElementById("weekday-add");
const weekDayEdit = document.getElementById("weekday-edit");
const currentDuration = document.getElementById("current-duration");
const cam1Btn = document.getElementById("cam1-button");
const cam2Btn = document.getElementById("cam2-button");
const cam1BtnStatus = document.getElementById("cam1-button-status");
const cam2BtnStatus = document.getElementById("cam2-button-status");
const autoModeBtn = document.getElementById("auto-mode-button");
const manualModeBtn = document.getElementById("manual-mode-button");

const currentWeekDay = (new Date).getDay(); 

let durations = [];

let convert = {
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
  7: "sun",
}

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
    document.getElementById(camName).src = "http://" + cam.ip + "/stream";
    // document.getElementById("cam2").src = "http://" + cams.cam2.ip + "/stream";
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
    setTimeout(() => connectWebSocket(camName), 30000);
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
  // const el = document.getElementById(camName + "-status");
  // el.innerText = online ? "ONLINE" : "OFFLINE";
  // el.style.color = online ? "green" : "red";
  if(!online) {
    document.getElementById(camName).src = "../assets/images/gray.png"
  }
}
document.addEventListener("DOMContentLoaded", ()=> {
  fetch("../user/get-ip.php")
    .then(res => res.json())
    .then(data => {
      const {ip_address_1, ip_address_2} = data["ip_addresses"]
      cams.cam1.ip = ip_address_1;
      cams.cam2.ip = ip_address_2;
      
      // document.getElementById("cam1").src = "http://" + cams.cam1.ip + "/stream";
      // document.getElementById("cam2").src = "http://" + cams.cam2.ip + "/stream";
    
      connectWebSocket("cam1");
      connectWebSocket("cam2");
    })
    .catch(err => {
      console.log(err)
    })
  
  fetch("../user/get_durations.php")
    .then(res => res.json())
    .then(data => {
      durations = data["schedules"];

      currentDuration.value = findDuration(currentWeekDay === 0 ? 7 : currentWeekDay);
    })
  })

function findDuration(weekDay) {
  let durationOfDay;
  console.log(weekDay)
  durations.forEach(duration => {
    if(duration["week_day"] == weekDay) {
      durationOfDay = duration["duration"];
      console.log(duration["duration"]);
    }
  })
  console.log(durationOfDay)
  return durationOfDay;
}

function activateForm(id) {
  document.querySelectorAll(".weekday-form").forEach(form => {
    form.classList.add("hidden");
  })
  document.getElementById(id).classList.remove("hidden");
}


weekDays.querySelectorAll("button[data-week]").forEach(btn => {
  btn.addEventListener("click", (e) => {
      const dayDuration = findDuration(e.target.dataset.week);
      if(dayDuration) {
        weekDayDurationEdit.value = dayDuration;
        weekDayEdit.value = e.target.dataset.week;
        activateForm("edit-weekday-form");
        handleFormSubmit(
          "edit-weekday-form",
          (data) => {
            document.getElementById("edit-weekday-form-result").innerText = data.message
            location.reload();
          },
          (error) => {document.getElementById("edit-weekday-form-result").innerText = data.message}
        )
      }else{
        weekDayDurationEdit.value = "";
        weekDayDurationAdd.value = "";
        weekDayAdd.value = e.target.dataset.week;
        activateForm("add-weekday-form");
        handleFormSubmit(
          "add-weekday-form",
          (data) => {
            document.getElementById("add-weekday-form-result").innerText = data.message
            location.reload();
          },
          (error) => {document.getElementById("add-weekday-form-result").innerText = data.message}
        )
      }
    })
})

cam1Btn.addEventListener("click", async() => {
  const color = cam1Btn.dataset.color;
  if(color === "green") {
    cam1Btn.innerText = "Red ON";
    sendLED('cam1', 'green_on');
    sendLED('cam2', 'red_on');
    const res = await fetch(`http://${cams.cam2.ip}/check-red`, {method: "GET", headers:{'Content-Type': 'application/json'}})
    const result = await res.json();
    if(!result.state) {
      cam2BtnStatus.innerText = "Red LED is not working";
    }
    const res1 = await fetch(`http://${cams.cam1.ip}/check-green`, {method: "GET", headers:{'Content-Type': 'application/json'}})
    const result1 = await res1.json();
    if(!result1.state) {
      cam1BtnStatus.innerText = "Green LED is not working";
    }
    cam1Btn.dataset.color = "red";

    cam2Btn.innerText = "Green ON";
    cam2Btn.dataset.color = "green";
    cam1BtnStatus.innerText = "Green Light";
    cam2BtnStatus.innerText = "Red Light";
  }else {
    cam1Btn.innerText = "Green ON";
    sendLED('cam1', 'red_on');
    sendLED('cam2', 'green_on');
    const res = await fetch(`http://${cams.cam1.ip}/check-red`, {method: "GET", headers:{'Content-Type': 'application/json'}})
    const result = await res.json();
    if(!result.state) {
      cam1BtnStatus.innerText = "Red LED is not working";
    }
    const res1 = await fetch(`http://${cams.cam2.ip}/check-green`, {method: "GET", headers:{'Content-Type': 'application/json'}})
    const result1 = await res1.json();
    if(!result1.state) {
      cam1BtnStatus.innerText = "Green LED is not working";
    }
    cam1Btn.dataset.color = "green";
    cam1BtnStatus.innerText = "Red Light";


    cam2Btn.innerText = "Red ON"
    cam2Btn.dataset.color = "red";
    cam2BtnStatus.innerText = "Green Light";
  }
})

cam2Btn.addEventListener("click", async() => {
  const color = cam2Btn.dataset.color;
  if(color === "green") {
    cam2Btn.innerText = "Red ON";
    sendLED('cam2', 'green_on');
    const res = await fetch(`http://${cams.cam2.ip}/check-green`, {method: "GET", headers:{'Content-Type': 'application/json'}})
    const result = await res.json();
    if(!result.state) {
      cam2BtnStatus.innerText = "Green LED is not working";
    }
    sendLED('cam1', 'red_on');
    const res1 = await fetch(`http://${cams.cam1.ip}/check-red`, {method: "GET", headers:{'Content-Type': 'application/json'}})
    const result1 = await res1.json();
    if(!result1.state) {
      cam2BtnStatus.innerText = "Red LED is not working";
    }
    cam2Btn.dataset.color = "red";
    
    cam1Btn.innerText = "Green ON";
    cam1Btn.dataset.color = "green";
    cam1BtnStatus.innerText = "Green Light";
    cam2BtnStatus.innerText = "Red Light";
  }else {
    cam2Btn.innerText = "Green ON";
    sendLED('cam2', 'red_on');
    const res = await fetch(`http://${cams.cam1.ip}/check-red`, {method: "GET", headers:{'Content-Type': 'application/json'}})
    const result = await res.json();
    if(!result.state) {
      cam2BtnStatus.innerText = "Red LED is not working";
    }
    sendLED('cam1', 'green_on');
    const res1 = await fetch(`http://${cams.cam1.ip}/check-green`, {method: "GET", headers:{'Content-Type': 'application/json'}})
    const result1 = await res1.json();
    if(!result1.state) {
      cam2BtnStatus.innerText = "Green LED is not working";
    }

    cam2Btn.dataset.color = "green";
    cam1Btn.innerText = "Red ON"
    cam1Btn.dataset.color = "red";
    cam1BtnStatus.innerText = "Red Light";
    cam2BtnStatus.innerText = "Green Light";
  }
})

async function count(num) {
  return new Promise((res) => {
    setInterval(() => {
      res(num);
  }, 1000)})
}

function toggleMode(id) {
  document.querySelectorAll(".mode-view").forEach(view => {
    view.classList.add("hidden");
  })
  document.getElementById(id).classList.remove("hidden");
}

autoModeBtn.addEventListener("click", async () => {
  toggleMode("auto-mode");
  console.log("click")
  while(true){
    sendLED("cam1", "green_on");
    sendLED("cam2", "red_on");
    for (let i = currentDuration.value; i > 0; i--) {
      const num = await count(i);
      document.getElementById("cam1-count").innerText = num
    }
    document.getElementById("cam1-count").innerText = "";
    sendLED("cam1", "red_on");
    sendLED("cam2", "green_on");
    for (let i =  currentDuration.value; i > 0; i--) {
      const num = await count(i);
      document.getElementById("cam2-count").innerText = num
    }
    document.getElementById("cam2-count").innerText = "";
  }
})
manualModeBtn.addEventListener("click", () => {toggleMode("manual-mode")})


handleFormSubmit("change-ip-form",
    (data)=>(document.getElementById("ip-result").innerText = data.message),
    (error) => (document.getElementById("ip-result") = error.message),
);