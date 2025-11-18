import { handleFormSubmit } from "./formHandler.js";

const startButton = document.getElementById("start-traffic-light");
const weekDays = document.getElementById("week-days");
const weekDayDurationEdit = document.getElementById("weekday-duration-edit");
const weekDayDurationAdd = document.getElementById("weekday-duration-add");
const durationFormAdd = document.getElementById("add-weekday-form");
const durationFormEdit = document.getElementById("edit-weekday-form");
const weekDayAdd = document.getElementById("weekday-add");
const weekDayEdit = document.getElementById("weekday-edit");

console.log(weekDayDurationAdd)

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
  
  fetch("../user/get_durations.php")
    .then(res => res.json())
    .then(data => {
      durations = data["schedules"];
    })
  })

function findDuration(weekDay) {
  let durationOfDay;
  durations.forEach(duration => {
    if(duration["week_day"] == weekDay) {
      durationOfDay = duration["duration"];
    }
  })
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

