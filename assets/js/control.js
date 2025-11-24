import { handleFormSubmit } from "./formHandler.js";
import { openInfoModal, closeInfoModal } from "./infoModal.js";

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

let ledStateTimers = {
  cam1: {
    color: null,
    startTime: null,
    duration: 0
  },
  cam2: {
    color: null,
    startTime: null,
    duration: 0
  }
};

let manualDurationInterval = null;

function startDurationTracking(camName, color) {
  // Stop previous tracking for this camera
  if (ledStateTimers[camName].startTime) {
    stopDurationTracking(camName);
  }
  
  // Start new tracking
  ledStateTimers[camName] = {
    color: color,
    startTime: Date.now(),
    duration: 0
  };
  
  // Update display every second
  updateDurationDisplay(camName);
  
  console.log(`Started tracking ${camName} ${color} at ${new Date().toLocaleTimeString()}`);
}

function stopDurationTracking(camName) {
  if (ledStateTimers[camName].startTime) {
    const endTime = Date.now();
    const totalDuration = Math.floor((endTime - ledStateTimers[camName].startTime) / 1000);
    
    // Log the duration to your database
    logLightChange(camName, ledStateTimers[camName].color, 'manual', totalDuration);
    
    console.log(`${camName} ${ledStateTimers[camName].color} was on for ${totalDuration} seconds`);
    
    // Reset tracking
    ledStateTimers[camName] = {
      color: null,
      startTime: null,
      duration: 0
    };
  }
}

function updateDurationDisplay(camName) {
  manualDurationInterval = setInterval(() => {
    if (ledStateTimers[camName].startTime) {
      const currentDuration = Math.floor((Date.now() - ledStateTimers[camName].startTime) / 1000);
      ledStateTimers[camName].duration = currentDuration;
      
      // Update the display element
      const durationElement = document.getElementById(`${camName}-duration`);
      if (durationElement) {
        durationElement.textContent = `${ledStateTimers[camName].color.toUpperCase()}: ${currentDuration}s`;
      }
    } else {
      clearInterval(manualDurationInterval);
    }
  }, 1000);
}

function getCurrentDuration(camName) {
  if (ledStateTimers[camName].startTime) {
    return Math.floor((Date.now() - ledStateTimers[camName].startTime) / 1000);
  }
  return 0;
}

function openErrorModal(message) {
    openInfoModal({
        title: "Error",
        body: `<p>${message}</p>`,
        footer: `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    })

    setTimeout(() => {
        closeInfoModal();
        location.reload();
    }, 3000);
}

function openSuccessModal(message) {
    openInfoModal({
        title: "Success",
        body: `<p>${message}</p>`,
        footer: `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    })

    setTimeout(() => {
        closeInfoModal();
        location.reload();
    }, 3000);
}

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
    if(camName === 'cam1') {
      sendLED('cam1', 'green_on');
      checkLed("cam1", cams.cam1.ip, "green", "manual");
      document.getElementById(`${camName}-error-icon`).style.display = 'none';
    }else {
      sendLED('cam2', 'red_on');
      checkLed("cam2", cams.cam2.ip, "red", "manual")
      document.getElementById(`${camName}-error-icon`).style.display = 'none';
    }
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
    console.log("error");
    openErrorModal(camName + " is not connected.");
  }
}
async function logLightChange(cameraId, lightState, modeType, duration = null) {
    try {
        const response = await fetch('../admin/log-traffic.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                camera_id: cameraId,
                light_state: lightState,
                mode_type: modeType,
                duration_seconds: duration
            })
        });
        
        if (!response.ok) {
            console.error('Failed to log traffic change');
        }
    } catch (error) {
        console.error('Log error:', error);
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

async function checkLed(camName, ip, color, mode) {
  try {
    const res = await fetch(`http://${ip}/check-${color}`, {method: "GET", headers:{'Content-Type': 'application/json'}})
    const result = await res.json();

    if(!result.state) {
      openErrorModal(`${color} LED is not working`);
      return false;
    }
    return true;
  }catch(error) {
    openErrorModal(`Failed to check ${camName} LED status`);
      return false;
  }
}

cam1Btn.addEventListener("click", async() => {
  const color = cam1Btn.dataset.color;
  if(color === "green") {
    
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');

    cam1Btn.innerText = "Red ON";

    sendLED('cam1', 'green_on');
    sendLED('cam2', 'red_on');
    
    checkLed("cam2", cams.cam2.ip, "red", "manual")
    checkLed("cam1", cams.cam1.ip, "green", "manual")

    startDurationTracking('cam1', 'green');
    startDurationTracking('cam2', 'red');

    cam1Btn.dataset.color = "red";
    cam2Btn.innerText = "Green ON";
    cam2Btn.dataset.color = "green";
    cam1BtnStatus.innerText = "Green Light";
    cam2BtnStatus.innerText = "Red Light";
  }else {
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');

    cam1Btn.innerText = "Green ON";
    
    sendLED('cam1', 'red_on');
    sendLED('cam2', 'green_on');

    checkLed("cam1", cams.cam1.ip, "red", "manual")
    checkLed("cam2", cams.cam2.ip, "green", "manual")

    startDurationTracking('cam1', 'green');
    startDurationTracking('cam2', 'red');

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
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');

    cam2Btn.innerText = "Red ON";
    
    sendLED('cam2', 'green_on');
    sendLED('cam1', 'red_on');
    
    checkLed("cam2", cams.cam2.ip, "green", "manual")
    checkLed("cam1", cams.cam1.ip, "red", "manual")

    startDurationTracking('cam1', 'red');
    startDurationTracking('cam2', 'green');
    
    cam2Btn.dataset.color = "red";
    cam1Btn.innerText = "Green ON";
    cam1Btn.dataset.color = "green";
    cam1BtnStatus.innerText = "Green Light";
    cam2BtnStatus.innerText = "Red Light";
  }else {
    cam2Btn.innerText = "Green ON";

    stopDurationTracking('cam1');
    stopDurationTracking('cam2');

    sendLED('cam2', 'red_on');
    sendLED('cam1', 'green_on');

    checkLed("cam2", cams.cam2.ip, "red", "manual")
    checkLed("cam1", cams.cam1.ip, "green", "manual")

    startDurationTracking('cam2', 'red');
    startDurationTracking('cam1', 'green');
    
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

handleFormSubmit("change-ip-form",
    (data)=>(openSuccessModal(data.message)),
    (error) => (openErrorModal(error.message)),
);


// Automatic
let isAutoModeRunning = false;
let autoModeController = null;

async function startAutoMode() {
  autoModeController = new AbortController();
  isAutoModeRunning = true;

  try {
    while(!autoModeController.signal.aborted){
      
      if (autoModeController.signal.aborted) {
        console.log("Auto mode aborted");
        break;
      }
      
      sendLED("cam1", "green_on");
      sendLED("cam2", "red_on");
      
      const cam1Check =  await checkLed("cam1", cams.cam1.ip, "green", "auto")
      const cam2Check =  await checkLed("cam2", cams.cam2.ip, "red", "auto")

      if (!cam1Check || !cam2Check) {
        console.log("LED check failed, aborting auto mode");
        stopAutoMode();
        openErrorModal("Auto mode stopped due to LED malfunction");
        return;
      }

      for (let i = currentDuration.value; i > 0; i--) {
        if (autoModeController.signal.aborted) {
          console.log("Auto mode aborted during countdown");
          return;
        }

        const num = await count(i);
        document.getElementById("cam1-count").innerText = num
      }

      if (!autoModeController.signal.aborted) {
        logLightChange("cam1", "green", "auto", findDuration(currentWeekDay === 0 ? 7 : currentWeekDay))
        logLightChange("cam2", "red", "auto", findDuration(currentWeekDay === 0 ? 7 : currentWeekDay))
        document.getElementById("cam1-count").innerText = "0";
      }

      if (autoModeController.signal.aborted) {
        console.log("Auto mode aborted before second phase");
        break;
      }
      
      sendLED("cam1", "red_on");
      sendLED("cam2", "green_on");

      const cam1Check2 = await checkLed("cam1", cams.cam1.ip, "red", "auto")
      const cam2Check2 = await checkLed("cam2", cams.cam2.ip, "green", "auto")

      if (!cam1Check2 || !cam2Check2) {
        console.log("LED check failed in second phase, aborting auto mode");
        stopAutoMode();
        openErrorModal("Auto mode stopped due to LED malfunction");
        return;
      }

      for (let i =  currentDuration.value; i > 0; i--) {
        if (autoModeController.signal.aborted) {
          console.log("Auto mode aborted during second countdown");
          return;
        }

        const num = await count(i);
        document.getElementById("cam2-count").innerText = num
      }
      if (!autoModeController.signal.aborted) {
        logLightChange("cam1", "red", "auto", findDuration(currentWeekDay === 0 ? 7 : currentWeekDay));
        logLightChange("cam2", "green", "auto", findDuration(currentWeekDay === 0 ? 7 : currentWeekDay));
        document.getElementById("cam2-count").innerText = "0";
      }
    }
  } catch(error){
    console.error("Auto mode error:", error);
    openErrorModal("Auto mode encountered an error and was stopped");
  } finally {
    stopAutoMode();
  }
}

function stopAutoMode() {
  if (autoModeController) {
    autoModeController.abort();
  }
  
  isAutoModeRunning = false;
  
  // Reset button
  autoModeBtn.textContent = "Start Auto Mode";
  autoModeBtn.classList.remove("btn-danger");
  autoModeBtn.classList.add("btn-success");
  
  // Clear countdown displays
  document.getElementById("cam1-count").innerText = "";
  document.getElementById("cam2-count").innerText = "";
  
  console.log("Auto mode stopped");
}

autoModeBtn.addEventListener("click", async () => {
  startAutoMode();
})

document.addEventListener("DOMContentLoaded", ()=> {
  fetch("../user/get-ip.php")
    .then(res => res.json())
    .then(data => {
      const {ip_address_1, ip_address_2} = data["ip_addresses"]
      cams.cam1.ip = ip_address_1;
      cams.cam2.ip = ip_address_2;
      
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