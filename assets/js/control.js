import { handleFormSubmit } from "./formHandler.js";
import { openInfoModal, closeInfoModal } from "./infoModal.js";

// Add null checks to prevent errors when elements don't exist
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
const durationInput = document.getElementById("duration-input");
const saveDurationBtn = document.getElementById("save-duration-btn");
const durationResult = document.getElementById("duration-result");

// Check if essential elements exist
if (!cam1Btn || !cam2Btn) {
  console.error('Required camera control buttons not found');
}

// Track selected weekday for duration input
let selectedWeekday = 1; // Default to Monday

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

let manualDurationIntervals = {};

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
    
    // Clear interval for this camera
    if (manualDurationIntervals[camName]) {
      clearInterval(manualDurationIntervals[camName]);
      delete manualDurationIntervals[camName];
    }
    
    // Reset tracking
    ledStateTimers[camName] = {
      color: null,
      startTime: null,
      duration: 0
    };
  }
}

function updateDurationDisplay(camName) {
  // Clear existing interval for this camera
  if (manualDurationIntervals[camName]) {
    clearInterval(manualDurationIntervals[camName]);
  }
  
  manualDurationIntervals[camName] = setInterval(() => {
    if (ledStateTimers[camName].startTime) {
      const currentDuration = Math.floor((Date.now() - ledStateTimers[camName].startTime) / 1000);
      ledStateTimers[camName].duration = currentDuration;
      
      // Update the display element
      const durationElement = document.getElementById(`${camName}-duration`);
      if (durationElement) {
        durationElement.textContent = `${ledStateTimers[camName].color.toUpperCase()}: ${currentDuration}s`;
      }
    } else {
      clearInterval(manualDurationIntervals[camName]);
      delete manualDurationIntervals[camName];
    }
  }, 1000);
}

function getCurrentDuration(camName) {
  if (ledStateTimers[camName].startTime) {
    return Math.floor((Date.now() - ledStateTimers[camName].startTime) / 1000);
  }
  return 0;
}

// Add missing logLightChange function
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
  
  // Check if IP is available
  if (!cam.ip) {
    console.error(`No IP address configured for ${camName}`);
    document.getElementById(`${camName}-error-icon`).style.display = 'block';
    return;
  }
  
  const wsURL = "ws://" + cam.ip + "/ws";

  console.log(`Connecting WS for ${camName}: ${wsURL}`);

  try {
    cam.ws = new WebSocket(wsURL);
  } catch (error) {
    console.error(`Failed to create WebSocket for ${camName}:`, error);
    document.getElementById(`${camName}-error-icon`).style.display = 'block';
    return;
  }

  cam.ws.onopen = () => {
    cam.connected = true;
    updateStatus(camName, true);
    document.getElementById(camName).src = "http://" + cam.ip + "/stream";
    // document.getElementById("cam2").src = "http://" + cams.cam2.ip + "/stream";
    if(camName === 'cam1') {
      sendLED('cam1', 'green_on');
      checkLed("cam1", cams.cam1.ip, "green", "manual");
      updateLEDButton('cam1', 'green', true);
      document.getElementById(`${camName}-error-icon`).style.display = 'none';
    }else {
      sendLED('cam2', 'red_on');
      checkLed("cam2", cams.cam2.ip, "red", "manual")
      updateLEDButton('cam2', 'red', true);
      document.getElementById(`${camName}-error-icon`).style.display = 'none';
    }
    console.log(`${camName} WebSocket connected`);
  };

  cam.ws.onmessage = (e) => {
    console.log(`${camName} says:`, e.data);
  };

  cam.ws.onerror = (error) => {
    console.error(`${camName} WebSocket error:`, error);
    cam.connected = false;
    updateStatus(camName, false);
    document.getElementById(`${camName}-error-icon`).style.display = 'block';
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
  if (cam.connected && cam.ws && cam.ws.readyState === WebSocket.OPEN) {
    try {
      cam.ws.send(cmd);
      console.log(`Sent to ${camName}: ${cmd}`);
    } catch (error) {
      console.error(`Failed to send command to ${camName}:`, error);
      cam.connected = false;
      updateStatus(camName, false);
      openErrorModal(`Failed to send command to ${camName}. Connection lost.`);
    }
  } else {
    console.error(`${camName} is not connected or WebSocket is not ready`);
    document.getElementById(`${camName}-error-icon`).style.display = 'block';
    openErrorModal(`${camName} is not connected. Please check the camera connection.`);
  }
}
// async function logLightChange(cameraId, lightState, modeType, duration = null) {
//     try {
//         const response = await fetch('../admin/log-traffic.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'include',
//             body: JSON.stringify({
//                 camera_id: cameraId,
//                 light_state: lightState,
//                 mode_type: modeType,
//                 duration_seconds: duration
//             })
//         });
        
//         if (!response.ok) {
//             console.error('Failed to log traffic change');
//         }
//     } catch (error) {
//         console.error('Log error:', error);
//     }
// }

function updateStatus(camName, online) {
  // const el = document.getElementById(camName + "-status");
  // el.innerText = online ? "ONLINE" : "OFFLINE";
  // el.style.color = online ? "green" : "red";
  if(!online) {
    document.getElementById(camName).src = "../assets/images/gray.png"
  }
}

function updateLEDButton(camName, color, isOn) {
  const button = document.getElementById(`${camName}-button`);
  const ledText = button.querySelector('.led-text');
  
  if (isOn) {
    button.setAttribute('data-state', 'on');
    ledText.textContent = `${camName.toUpperCase()}: ${color.toUpperCase()}`;
  } else {
    button.setAttribute('data-state', 'off');
    ledText.textContent = `${camName.toUpperCase()}: OFF`;
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
      // Remove active class from all buttons
      weekDays.querySelectorAll("button[data-week]").forEach(b => b.classList.remove("active"));
      // Add active class to clicked button
      e.target.classList.add("active");
      
      selectedWeekday = e.target.dataset.week;
      const dayDuration = findDuration(selectedWeekday);
      
      // Update duration input with existing value or clear it
      if (durationInput) {
        durationInput.value = dayDuration || "";
        durationInput.placeholder = `Duration for ${e.target.textContent}`;
      }
      
      // Clear any previous result messages
      if (durationResult) {
        durationResult.innerHTML = "";
      }
    })
})

// Handle duration save button
if (saveDurationBtn && durationInput) {
  saveDurationBtn.addEventListener("click", async () => {
    const duration = durationInput.value;
    if (!duration || duration <= 0) {
      durationResult.innerHTML = '<div class="alert alert-danger alert-sm">Please enter a valid duration</div>';
      return;
    }
    
    const existingDuration = findDuration(selectedWeekday);
    const action = existingDuration ? 'edit' : 'add';
    const url = action === 'edit' ? '../admin/edit-duration.php' : '../admin/insert-duration.php';
    
    try {
      const requestData = {
        'user-id': document.querySelector('input[name="user-id"]').value,
        'weekday': selectedWeekday,
        'weekday-duration': duration
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        durationResult.innerHTML = `<div class="alert alert-success alert-sm">${result.message}</div>`;
        // Update the durations array
        if (action === 'add') {
          durations.push({week_day: selectedWeekday, duration: duration});
        } else {
          const durationObj = durations.find(d => d.week_day == selectedWeekday);
          if (durationObj) durationObj.duration = duration;
        }
        // Update current duration if it's the current day
        if (selectedWeekday == (currentWeekDay === 0 ? 7 : currentWeekDay)) {
          currentDuration.value = duration;
        }
      } else {
        durationResult.innerHTML = `<div class="alert alert-danger alert-sm">${result.message}</div>`;
      }
    } catch (error) {
      console.error('Error saving duration:', error);
      durationResult.innerHTML = '<div class="alert alert-danger alert-sm">Error saving duration</div>';
    }
    
    // Clear result after 3 seconds
    setTimeout(() => {
      if (durationResult) durationResult.innerHTML = '';
    }, 3000);
  });
}

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
  // Check if cameras are connected before proceeding
  if (!cams.cam1.connected || !cams.cam2.connected) {
    openErrorModal("Both cameras must be connected to control traffic lights");
    return;
  }
  
  const color = cam1Btn.dataset.color;
  if(color === "green") {
    
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');

    sendLED('cam1', 'green_on');
    sendLED('cam2', 'red_on');
    
    checkLed("cam2", cams.cam2.ip, "red", "manual")
    checkLed("cam1", cams.cam1.ip, "green", "manual")

    startDurationTracking('cam1', 'green');
    startDurationTracking('cam2', 'red');

    // Update button states
    updateLEDButton('cam1', 'green', true);
    updateLEDButton('cam2', 'red', true);
    
    cam1Btn.dataset.color = "red";
    cam2Btn.dataset.color = "green";
    if (cam1BtnStatus) cam1BtnStatus.innerText = "Green Light";
    if (cam2BtnStatus) cam2BtnStatus.innerText = "Red Light";
  }else {
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');
    
    sendLED('cam1', 'red_on');
    sendLED('cam2', 'green_on');

    checkLed("cam1", cams.cam1.ip, "red", "manual")
    checkLed("cam2", cams.cam2.ip, "green", "manual")

    startDurationTracking('cam1', 'red');
    startDurationTracking('cam2', 'green');

    // Update button states
    updateLEDButton('cam1', 'red', true);
    updateLEDButton('cam2', 'green', true);
    
    cam1Btn.dataset.color = "green";
    cam2Btn.dataset.color = "red";
    if (cam1BtnStatus) cam1BtnStatus.innerText = "Red Light";
    if (cam2BtnStatus) cam2BtnStatus.innerText = "Green Light";
  }
})

cam2Btn.addEventListener("click", async() => {
  // Check if cameras are connected before proceeding
  if (!cams.cam1.connected || !cams.cam2.connected) {
    openErrorModal("Both cameras must be connected to control traffic lights");
    return;
  }
  
  const color = cam2Btn.dataset.color;
  if(color === "green") {
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');
    
    sendLED('cam2', 'green_on');
    sendLED('cam1', 'red_on');
    
    checkLed("cam2", cams.cam2.ip, "green", "manual")
    checkLed("cam1", cams.cam1.ip, "red", "manual")

    startDurationTracking('cam1', 'red');
    startDurationTracking('cam2', 'green');
    
    // Update button states
    updateLEDButton('cam1', 'red', true);
    updateLEDButton('cam2', 'green', true);
    
    cam2Btn.dataset.color = "red";
    cam1Btn.dataset.color = "green";
    if (cam1BtnStatus) cam1BtnStatus.innerText = "Red Light";
    if (cam2BtnStatus) cam2BtnStatus.innerText = "Green Light";
  }else {
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');

    sendLED('cam2', 'red_on');
    sendLED('cam1', 'green_on');

    checkLed("cam2", cams.cam2.ip, "red", "manual")
    checkLed("cam1", cams.cam1.ip, "green", "manual")

    startDurationTracking('cam2', 'red');
    startDurationTracking('cam1', 'green');
    
    // Update button states
    updateLEDButton('cam1', 'green', true);
    updateLEDButton('cam2', 'red', true);
    
    cam2Btn.dataset.color = "green";
    cam1Btn.dataset.color = "red";
    if (cam1BtnStatus) cam1BtnStatus.innerText = "Green Light";
    if (cam2BtnStatus) cam2BtnStatus.innerText = "Red Light";
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
  // Check if cameras are connected before starting auto mode
  if (!cams.cam1.connected || !cams.cam2.connected) {
    openErrorModal("Both cameras must be connected to start auto mode");
    return;
  }
  
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
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      const {ip_address_1, ip_address_2} = data["ip_addresses"] || {};
      
      if (!ip_address_1 || !ip_address_2) {
        openErrorModal("Camera IP addresses are not configured. Please set up IP addresses first.");
        return;
      }
      
      cams.cam1.ip = ip_address_1;
      cams.cam2.ip = ip_address_2;
      
      connectWebSocket("cam1");
      connectWebSocket("cam2");
    })
    .catch(err => {
      console.error("Failed to fetch camera IP addresses:", err);
      openErrorModal("Failed to load camera configuration. Please refresh the page.");
    })
  
  fetch("../user/get_durations.php")
    .then(res => res.json())
    .then(data => {
      durations = data["schedules"];

      currentDuration.value = findDuration(currentWeekDay === 0 ? 7 : currentWeekDay);
      
      // Initialize duration input with current day's duration
      if (durationInput) {
        const currentDayDuration = findDuration(currentWeekDay === 0 ? 7 : currentWeekDay);
        durationInput.value = currentDayDuration || "";
        durationInput.placeholder = "Duration for today";
      }
    })
    
  // Initialize LED button states as OFF
  updateLEDButton('cam1', 'green', false);
  updateLEDButton('cam2', 'red', false);
})