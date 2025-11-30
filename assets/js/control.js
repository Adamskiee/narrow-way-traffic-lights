import { handleFormSubmit } from "./formHandler.js";
import {
  openInfoModal,
  closeInfoModal,
  openConfirmModal,
} from "./infoModal.js";
import { setupRealtimeValidation, showFieldError, clearFieldError } from "./validate.js";

// ================================================================
// PRIVILEGE ACCESS CONTROL
// ================================================================

const USER_ROLE = window.userRole || "operator";
const IS_ADMIN = window.isAdmin || false;
const CAN_CONTROL_CAMERAS = window.canControlCameras || false;

function requireAdmin(action = "perform this action") {
  if (!IS_ADMIN) {
    showPrivilegeError(`Admin privileges required to ${action}`);
    return false;
  }
  return true;
}

function requireCameraAccess(action = "control cameras") {
  if (!CAN_CONTROL_CAMERAS) {
    showPrivilegeError(`Camera access required to ${action}`);
    return false;
  }
  return true;
}

function showPrivilegeError(message) {
  const alert = document.createElement("div");
  alert.className =
    "alert alert-warning alert-dismissible fade show privilege-alert";
  alert.innerHTML = `
        <i class="fas fa-lock me-2"></i>
        <strong>Access Denied:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  const container = document.querySelector(".container");
  container.insertBefore(alert, container.firstChild);

  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}

function initializePrivilegeRestrictions() {
  if (USER_ROLE === "operator") {
    const camControls = document.querySelectorAll(".led-control");
    camControls.forEach((control) => {
      control.closest(".col").classList.add("cam-controls-operator");
    });

    disableAdminFeatures();
  }
}

function disableAdminFeatures() {
  const weekDayButtons = document.querySelectorAll("#week-days button");
  weekDayButtons.forEach((btn) => {
    if (!IS_ADMIN) {
      btn.disabled = true;
      btn.classList.add("disabled");
    }
  });

  const ipForm = document.getElementById("change-ip-form");
  if (ipForm && !IS_ADMIN) {
    const inputs = ipForm.querySelectorAll("input, button");
    inputs.forEach((input) => {
      input.disabled = true;
    });
  }

  if (durationInputA && durationInputB && saveDurationBtn && !IS_ADMIN) {
    durationInputA.disabled = true;
    durationInputB.disabled = true;
    saveDurationBtn.disabled = true;
  }
}

// ================================================================
// CONSTANTS AND CONFIGURATION
// ================================================================

const WEBSOCKET_RECONNECT_DELAY = 3000;
const CAMERA_CONNECTION_TIMEOUT = 5000;
const AUTO_MODE_RESUME_DELAY = 3000;

const WEEKDAY_MAPPING = {
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
  7: "sun",
};

// ================================================================
// DOM ELEMENT REFERENCES
// ================================================================

const cam1Btn = document.getElementById("cam1-button");
const cam2Btn = document.getElementById("cam2-button");
const autoModeBtn = document.getElementById("auto-mode-button");
const overrideBtn = document.getElementById("override-btn");
const emergencyBtn = document.getElementById("emergency-btn");
const currentDelayBtn = document.getElementById("current-delay-btn");
const currentDurationABtn = document.getElementById("current-duration-a-btn");
const currentDurationBBtn = document.getElementById("current-duration-b-btn");
const changeIpBtn = document.getElementById("change-ip-btn");
const cancelChageIpBtn = document.getElementById("cancel-change-ip-btn")

const weekDays = document.getElementById("week-days");
const currentDurationA = document.getElementById("current-duration-a");
const currentDurationB = document.getElementById("current-duration-b");
const currentDelay = document.getElementById("current-delay");
const delayInput = document.getElementById("delay-input");
const durationInputA = document.getElementById("duration-input-a");
const durationInputB = document.getElementById("duration-input-b");
const saveDurationBtn = document.getElementById("save-duration-btn");
const durationResult = document.getElementById("duration-result");

if(IS_ADMIN) {
  
  if (!cam1Btn || !cam2Btn || !autoModeBtn) {
    console.error(
      "Critical control elements not found - camera buttons or auto mode button missing"
    );
  }
}
  
// ================================================================
// GLOBAL STATE MANAGEMENT
// ================================================================

let selectedWeekday = 1;
let durations = [];
const currentWeekDay = new Date().getDay();

const cams = {
  cam1: { ip: "", ws: null, connected: false },
  cam2: { ip: "", ws: null, connected: false },
};

let ledStateTimers = {
  cam1: { color: null, startTime: null, duration: 0 },
  cam2: { color: null, startTime: null, duration: 0 },
};

let manualDurationIntervals = {};

let isAutoModeRunning = false;
let autoModeController = null;
let mainDelay;

let currentDurations = {};

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Find duration for a specific weekday
 * @param {number} weekDay - Day of week (1-7)
 * @returns {number|undefined} Duration in seconds
 */
function findDuration(weekDay, type) {
  let durationOfDay;

  durations.forEach((duration) => {
    if (duration["week_day"] == weekDay) {
      durationOfDay = duration[`duration_${type}`];
    }
  });

  return durationOfDay;
}

/**
 * Async delay function for countdown timers
 * @param {number} num - Number to return after delay
 * @returns {Promise<number>} Delayed number
 */
async function count(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num);
    }, 1000);
  });
}

/**
 * Open error modal with message
 * @param {string} message - Error message to display
 */
function openErrorModal(message) {
  openInfoModal({
    title: "Error",
    body: `<p>${message}</p>`,
    footer: `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`,
  });

  // Remove auto-refresh to prevent interruptions during normal operation
  setTimeout(() => {
    closeInfoModal();
  }, 5000);
}

/**
 * Open success modal with message
 * @param {string} message - Success message to display
 */
function openSuccessModal(message) {
  openInfoModal({
    title: "Success",
    body: `<p>${message}</p>`,
    footer: `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`,
  });

  setTimeout(() => {
    closeInfoModal();
    location.reload();
  }, 3000);
}

// ================================================================
// DURATION TRACKING SYSTEM
// ================================================================

/**
 * Start tracking LED state duration for logging purposes
 * @param {string} camName - Camera name (cam1 or cam2)
 * @param {string} color - LED color (red or green)
 */
function startDurationTracking(camName, color) {
  if (ledStateTimers[camName].startTime) {
    stopDurationTracking(camName);
  }

  ledStateTimers[camName] = {
    color: color,
    startTime: Date.now(),
    duration: 0,
  };

  updateDurationDisplay(camName);
}

/**
 * Stop tracking LED state duration and log to database
 * @param {string} camName - Camera name (cam1 or cam2)
 */
function stopDurationTracking(camName) {
  if (ledStateTimers[camName].startTime) {
    const endTime = Date.now();
    const totalDuration = Math.floor(
      (endTime - ledStateTimers[camName].startTime) / 1000
    );

    logLightChange(
      camName,
      ledStateTimers[camName].color,
      "manual",
      totalDuration
    );

    if (manualDurationIntervals[camName]) {
      clearInterval(manualDurationIntervals[camName]);
      delete manualDurationIntervals[camName];
    }

    ledStateTimers[camName] = {
      color: null,
      startTime: null,
      duration: 0,
    };
  }
}

/**
 * Update duration display for manual mode tracking
 * @param {string} camName - Camera name (cam1 or cam2)
 */
function updateDurationDisplay(camName) {
  if (manualDurationIntervals[camName]) {
    clearInterval(manualDurationIntervals[camName]);
  }

  manualDurationIntervals[camName] = setInterval(() => {
    if (ledStateTimers[camName].startTime) {
      const currentDuration = Math.floor(
        (Date.now() - ledStateTimers[camName].startTime) / 1000
      );
      ledStateTimers[camName].duration = currentDuration;

      const durationElement = document.getElementById(`${camName}-duration`);
      if (durationElement) {
        durationElement.textContent = `${ledStateTimers[
          camName
        ].color.toUpperCase()}: ${currentDuration}s`;
      }
    } else {
      clearInterval(manualDurationIntervals[camName]);
      delete manualDurationIntervals[camName];
    }
  }, 1000);
}

async function logLightChange(cameraId, lightState, modeType, duration = null) {
  try {
    const response = await fetch("../admin/log-traffic.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        camera_name: cameraId,
        light_color: lightState,
        mode: modeType,
        duration: duration,
      }),
    });

    if (!response.ok) {
      console.error("Failed to log traffic change");
    }
  } catch (error) {
    console.error("Log error:", error);
  }
}

// ================================================================
// WEBSOCKET AND CAMERA MANAGEMENT
// ================================================================

/**
 * Initialize WebSocket connection for camera
 * @param {string} camName - Camera name (cam1 or cam2)
 */
function connectWebSocket(camName) {
  const cam = cams[camName];

  if (!cam.ip) {
    console.error(`No IP address configured for ${camName}`);
    document.getElementById(`${camName}-error-icon`).style.display = "block";
    return;
  }

  const wsURL = "ws://" + cam.ip + "/ws";

  try {
    cam.ws = new WebSocket(wsURL);
  } catch (error) {
    console.error(`Failed to create WebSocket for ${camName}:`, error);
    document.getElementById(`${camName}-error-icon`).style.display = "block";
    return;
  }

  cam.ws.onopen = () => {
    cam.connected = true;
    updateStatus(camName, true);
    // document.getElementById(camName).src = "http://" + cam.ip + "/stream";

    setTimeout(() => {
      const savedState = loadLEDState(camName);

      if (savedState && savedState.isOn) {
        const command = `${savedState.color}_on`;
        if (!sendLED(camName, command)) return;
        updateLEDButton(camName, savedState.color, true, false);
      } else {
        if (camName === "cam1") {
          if (!sendLED("cam1", "green_on")) return;
          updateLEDButton("cam1", "green", true);
        } else {
          if (!sendLED("cam2", "red_on")) return;
          updateLEDButton("cam2", "red", true);
        }
      }

      document.getElementById(`${camName}-error-icon`).style.display = "none";
    }, 1000);

    console.log(`${camName} WebSocket connected`);
  };

  cam.ws.onerror = (error) => {
    console.error(`${camName} WebSocket error:`, error);
    cam.connected = false;
    updateStatus(camName, false);

    updateLEDButton(camName, "red", false, false);

    if (isAutoModeRunning && !cams.cam1.connected && !cams.cam2.connected) {
      stopAutoMode();
      openErrorModal("Auto mode stopped due to camera disconnections");
    }
  };

  cam.ws.onclose = () => {
    cam.connected = false;
    updateStatus(camName, false);

    updateLEDButton(camName, "red", false, false);

    console.log(`${camName} WS closed — retrying in 30s`);

    if (isAutoModeRunning && !cams.cam1.connected && !cams.cam2.connected) {
      stopAutoMode();
      openErrorModal("Auto mode stopped due to camera disconnections");
    }

    setTimeout(() => connectWebSocket(camName), 30000);
  };

  cam.ws.onmessage = (event) => {
    if (event.data instanceof Blob) {
        const url = URL.createObjectURL(event.data);
        document.getElementById(camName).onload = () => URL.revokeObjectURL(url);
        document.getElementById(camName).src = url;
    }
  };
}

function sendLED(camName, cmd, isEmergency=false) {
  const cam = cams[camName];
  if (cam.connected && cam.ws && cam.ws.readyState === WebSocket.OPEN) {
    try {
      cam.ws.send(cmd);

      const color = cmd.includes("green") ? "green" : "red";
      if(!isEmergency) saveLEDState(camName, color, true);
      return true;
    } catch (error) {
      cam.connected = false;
      updateStatus(camName, false);
      openErrorModal(`Failed to send command to ${camName}. Connection lost.`);
      return false;
    }
  } else {
    document.getElementById(`${camName}-error-icon`).style.display = "block";
    openErrorModal(
      `${camName} is not connected. Please check the camera connection.`
    );
    return false;
  }
}

function updateStatus(camName, online) {
  const camImage = document.getElementById(camName);
  const errorIcon = document.getElementById(`${camName}-error-icon`);
  const ledButton = document.getElementById(`${camName}-button`);

  if (!online) {
    camImage.src = "../assets/images/gray.png";
    errorIcon.style.display = "block";

    if (ledButton) {
      ledButton.classList.add("disconnected");
      const ledText = ledButton.querySelector(".led-text");
      if (ledText) {
        ledText.textContent = `${camName.toUpperCase()}: DISCONNECTED`;
      }
    }

    console.warn(`${camName} is disconnected - UI updated`);
  } else {
    errorIcon.style.display = "none";

    if (ledButton) {
      ledButton.classList.remove("disconnected");
    }

    console.log(`${camName} is connected - UI updated`);
  }
}

// ================================================================
// STATE PERSISTENCE SYSTEM
// ================================================================

/**
 * Save LED state to localStorage
 * @param {string} camName - Camera name
 * @param {string} color - LED color
 * @param {boolean} isOn - Whether LED is on
 */
function saveLEDState(camName, color, isOn) {
  const state = {
    color: color,
    isOn: isOn,
    timestamp: Date.now(),
  };
  localStorage.setItem(`ledState_${camName}`, JSON.stringify(state));
}

/**
 * Load LED state from localStorage
 * @param {string} camName - Camera name
 * @returns {Object|null} Saved LED state or null
 */
function loadLEDState(camName) {
  try {
    const saved = localStorage.getItem(`ledState_${camName}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn(`Failed to load LED state for ${camName}:`, error);
    return null;
  }
}

/**
 * Save auto mode state to localStorage
 * @param {boolean} isRunning - Whether auto mode is running
 */
function saveAutoModeState(isRunning) {
  localStorage.setItem(
    "autoModeRunning",
    JSON.stringify({
      isRunning: isRunning,
      timestamp: Date.now(),
    })
  );
}

function loadAutoModeState() {
  try {
    const saved = localStorage.getItem("autoModeRunning");
    return saved ? JSON.parse(saved) : { isRunning: false };
  } catch (error) {
    console.warn("Failed to load auto mode state:", error);
    return { isRunning: false };
  }
}

function clearAutoModeState() {
  localStorage.removeItem("autoModeRunning");
}

function saveTimerState(phase, timeRemaining, startTime) {
  localStorage.setItem(
    "autoModeTimer",
    JSON.stringify({
      phase: phase,
      timeRemaining: timeRemaining,
      startTime: startTime,
      timestamp: Date.now(),
    })
  );
}

function loadTimerState() {
  try {
    const saved = localStorage.getItem("autoModeTimer");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn("Failed to load timer state:", error);
    return null;
  }
}

function clearTimerState() {
  localStorage.removeItem("autoModeTimer");
}

function saveDurationInputState(inputType) {
  let savedDurationsState = loadDurationInputState() ?? currentDurations;
  savedDurationsState[inputType] = currentDurations[inputType]
  localStorage.setItem("durationOverride", JSON.stringify(savedDurationsState))
}

function loadDurationInputState() {
  try {
    const saved = localStorage.getItem("durationOverride");
    return saved ? JSON.parse(saved) : null;
  }catch (error) {
    console.warn("Fialed to laod duration input:", error);
    return null
  }
}

function clearDurationInputState() {
  localStorage.removeItem("durationOverride");
}

function saveEmergencyState() {
  localStorage.setItem("emergencyState",
     JSON.stringify({
      isRunning: true
     }))
}

function loadEmergencyState() {
  try {
    const saved = localStorage.getItem("emergencyState");
    return saved ? JSON.parse(saved) : null;
  }catch (error) {
    console.warn("Fialed to laod duration input:", error);
    return null
  }
}

function clearEmergencyState() {
  localStorage.removeItem("emergencyState");
}

function calculateRemainingTime(savedTimer, isEmergency=false) {
  if (!savedTimer) return null;
  let remaining;
  if(!isEmergency) {
    const elapsed = Math.floor((Date.now() - savedTimer.timestamp) / 1000);
    remaining = savedTimer.timeRemaining - elapsed;
  }else {
    remaining = savedTimer.timeRemaining;
  }

  if (remaining <= 1) {
    return remaining > 0 ? remaining : 0;
  }

  return remaining > 0 ? remaining : 0;
}

function updateLEDButton(camName, color, isOn, saveState = true) {
  const button = document.getElementById(`${camName}-button`);
  const ledText = button.querySelector(".led-text");

  if (isOn) {
    button.setAttribute("data-state", "on");
    ledText.textContent = `${camName.toUpperCase()}: ${color.toUpperCase()}`;

    if (camName === "cam1") {
      if (color === "red") {
        button.classList.add("red-active");
        button.classList.remove("green-active");
      } else {
        button.classList.add("green-active");
        button.classList.remove("red-active");
      }
    } else if (camName === "cam2") {
      if (color === "green") {
        button.classList.add("green-active");
        button.classList.remove("red-active");
      } else {
        button.classList.add("red-active");
        button.classList.remove("green-active");
      }
    }

    button.dataset.color = color === "green" ? "red" : "green";
  } else {
    button.setAttribute("data-state", "off");
    ledText.textContent = `${camName.toUpperCase()}: OFF`;

    button.classList.remove("red-active", "green-active");

    if (camName === "cam1") {
      button.dataset.color = "green";
    } else {
      button.dataset.color = "red";
    }
  }

  if (saveState) {
    saveLEDState(camName, color, isOn);
  }
}

if (weekDays) {
  weekDays.querySelectorAll("button[data-week]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if(saveDurationBtn.dataset.state === "save") {
        openInfoModal({
          title: "Save duration",
          body: `
          <div class="text-center">
              <div class="mb-3">
                  <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
              </div>
              <h5 class="mb-3">Confirm to save duration</h5>
              <p class="mb-0">Are you sure you want to update duration?</p>
          </div>
          `,
          footer: `
          <button class="btn btn-secondary" id="dont-save-duration-modal-btn">
          <i class="fas fa-times me-1"></i>Don't save</button>
          <button class="btn btn-danger" id="save-duration-modal-btn">
          <i class="fas fa-times me-1"></i>Update</button>
          `
        });
        setTimeout(() => {
          const modalCloseBtn = document.querySelector('#infoModal .btn-close');
          const cancelOverrideBtn = document.getElementById('save-duration-modal-btn');
          const dontSaveDurationBtn = document.getElementById('dont-save-duration-modal-btn')
          
          if (modalCloseBtn) {
              modalCloseBtn.addEventListener('click', () => {
                  closeInfoModal();
              });
          }
          if(cancelOverrideBtn) {
            cancelOverrideBtn.addEventListener("click", () => {
              closeInfoModal()
              setTimeout(() => {
                durationInputA.disabled = true;
                durationInputB.disabled = true;
                saveDurationBtn.innerText = "edit"
                saveDurationBtn.dataset.state = "edit";
                performSaveDuration()
              }, 300)
            })
          }
          if(dontSaveDurationBtn) {
            dontSaveDurationBtn.addEventListener("click", () => {
              closeInfoModal()
              setTimeout(() => {
                durationInputA.disabled = true;
                durationInputB.disabled = true;
                saveDurationBtn.innerText = "edit"
                saveDurationBtn.dataset.state = "edit";
              }, 300)
            })
          }
          }, 100)
        return;
      }
      weekDays
        .querySelectorAll("button[data-week]")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");

      selectedWeekday = e.target.dataset.week;
      const dayDurationA = findDuration(selectedWeekday, "a");
      const dayDurationB = findDuration(selectedWeekday, "b");

      if (durationInputA) {
        durationInputA.value = dayDurationA || "";
        durationInputA.placeholder = `Duration A for ${e.target.textContent}`;
      }

      if (durationInputB) {
        durationInputB.value = dayDurationB || "";
        durationInputB.placeholder = `Duration B for ${e.target.textContent}`;
      }

      if (durationResult) {
        durationResult.innerHTML = "";
      }
    });
  });
}

if (saveDurationBtn && durationInputA && durationInputB) {
  saveDurationBtn.addEventListener("click", async () => {
    if(saveDurationBtn.dataset.state === "edit") {
      durationInputA.disabled = false;
      durationInputB.disabled = false;
      saveDurationBtn.innerText = "save"
      saveDurationBtn.dataset.state = "save";
      
    } else if (saveDurationBtn.dataset.state === "save") {
      const durationA = durationInputA.value;
      const durationB = durationInputB.value;

      const durationObj = durations.find(
        (d) => d.week_day == selectedWeekday
      );
      
      if(durationA == durationObj["duration_a"] && durationB == durationObj["duration_b"]) {
        durationInputA.disabled = true;
        durationInputB.disabled = true;
        saveDurationBtn.innerText = "edit"
        saveDurationBtn.dataset.state = "edit";
        return;
      }

      validateDuration(
        durationInputA.value,
        () => validateDuration(
          durationInputB.value,
          ()=>{ openInfoModal({
            title: "Save duration",
            body: `
            <div class="text-center">
                <div class="mb-3">
                    <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
                </div>
                <h5 class="mb-3">Confirm to save duration</h5>
                <p class="mb-0">Are you sure you want to update duration?</p>
            </div>
            `,
            footer: `
            <button class="btn btn-secondary" id="dont-save-duration-modal-btn">
            <i class="fas fa-times me-1"></i>Don't Save</button>
            <button class="btn btn-danger" id="save-duration-modal-btn">
            <i class="fas fa-times me-1"></i>Save</button>
            `
          });
          setTimeout(() => {
            const modalCloseBtn = document.querySelector('#infoModal .btn-close');
            const saveDurationModalBtn = document.getElementById('save-duration-modal-btn');
            const dontSaveDurationBtn = document.getElementById('dont-save-duration-modal-btn')
            if (modalCloseBtn) {
                modalCloseBtn.addEventListener('click', () => {
                    closeInfoModal();
                });
            }
            if(saveDurationModalBtn) {
              saveDurationModalBtn.addEventListener("click", () => {
                closeInfoModal()
                setTimeout(() => {
                  performSaveDuration()
                }, 300)
              })
            }
            if(dontSaveDurationBtn) {
              dontSaveDurationBtn.addEventListener("click", () => {
                closeInfoModal()
                setTimeout(() => {
                  durationInputA.disabled = true;
                  durationInputB.disabled = true;
                  saveDurationBtn.innerText = "edit"
                  saveDurationBtn.dataset.state = "edit";
                }, 300)
              })
            }
          }, 100)}
        )
      )
    }
  });
}

async function performSaveDuration() {
  durationInputA.disabled = true;
  durationInputB.disabled = true;
  saveDurationBtn.innerText = "edit"
  saveDurationBtn.dataset.state = "edit";
  const durationA = durationInputA.value;
  const durationB = durationInputB.value;
  if (!durationA || durationA <= 0) {
    durationResult.innerHTML =
      '<div class="alert alert-danger alert-sm">Please enter a valid duration</div>';
    return;
  }
  if (!durationB || durationB <= 0) {
    durationResult.innerHTML =
      '<div class="alert alert-danger alert-sm">Please enter a valid duration</div>';
    return;
  }

  try {
    const requestData = {
      weekday: selectedWeekday,
      "weekday-duration-a": durationA,
      "weekday-duration-b": durationB,
    };

    const response = await fetch("../admin/edit-duration.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (result.success) {
      durationResult.innerHTML = `<div class="alert alert-success alert-sm">${result.message}</div>`;
      durations.forEach( duration=> {
        if(duration["week_day"] == selectedWeekday) {
          duration["duration_a"] = parseInt(durationA);
          duration["duration_b"] = parseInt(durationB);
        }
      })

      const durationObj = durations.find(
        (d) => d.week_day == selectedWeekday
      );
      if (durationObj) {
        durationObj.durationA = durationA;
        durationObj.durationB = durationB;
      }

      if (selectedWeekday == (currentWeekDay === 0 ? 7 : currentWeekDay)) {
        currentDurationA.value = durationA;
        currentDurationB.value = durationB;
      }
    } else {
      durationResult.innerHTML = `<div class="alert alert-danger alert-sm">${result.message}</div>`;
    }
  } catch (error) {
    console.error("Error saving duration:", error);
    durationResult.innerHTML =
      '<div class="alert alert-danger alert-sm">Error saving duration</div>';
  }

  setTimeout(() => {
    if (durationResult) durationResult.innerHTML = "";
  }, 3000);
}
 
async function checkLed(camName, ip, color) {
  try {
    const res = await fetch(`http://${ip}/check-${color}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },

      timeout: 5000,
    });

    if (!res.ok) {
      console.warn(`HTTP ${res.status} when checking ${camName} ${color} LED`);
      return false;
    }

    const result = await res.json();

    if (!result.state) {
      console.warn(`${camName} ${color} LED is not working`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn(`Failed to check ${camName} LED status:`, error);
    return false;
  }
}

// ================================================================
// EVENT LISTENERS
// ================================================================

if (cam1Btn) {
  cam1Btn.addEventListener("click", async () => {
    if (!requireCameraAccess("control camera 1")) {
      return;
    }

    if (!cams.cam1.connected || !cams.cam2.connected) {
      openErrorModal(
        "Both cameras must be connected to control traffic lights"
      );
      return;
    }

    if (isAutoModeRunning) {
      return;
    }

    const color = cam1Btn.dataset.color;
    let cam1Check;
    let cam2Check;
    let failures = 0;
    if (color === "green") {
      stopDurationTracking("cam1");
      stopDurationTracking("cam2");

      if (!sendLED("cam1", "green_on")) return;
      if (!sendLED("cam2", "red_on")) return;

      try {
        cam2Check = await checkLed("cam2", cams.cam2.ip, "red");
        if (!cam2Check) {
          failures++;
          openErrorModal("Camera 2 Red LED is not working");
          console.warn("CAM2 red LED check failed");
        }
      } catch (error) {
        if (error.name === "TypeError" || error.message.includes("fetch")) {
          failures++;
          openErrorModal("Camera 2 connection failure");
          console.error("CAM2 critical connection failure:", error);
        }
      }

      try {
        cam1Check = await checkLed("cam1", cams.cam1.ip, "green");
        if (!cam1Check) {
          failures++;
          openErrorModal("Camera 1 Green LED is not working");
          console.warn("CAM1 green LED check failed");
        }
      } catch (error) {
        if (error.name === "TypeError" || error.message.includes("fetch")) {
          failures++;
          openErrorModal("Camera 1 connection failure");
          console.error("CAM1 critical connection failure:", error);
        }
      }

      if (failures >= 2) {
        openErrorModal("Both camera failed");
        return;
      }

      startDurationTracking("cam1", "green");
      startDurationTracking("cam2", "red");

      updateLEDButton("cam1", "green", true);
      updateLEDButton("cam2", "red", true);

      document.getElementById("cam1-count").style.display = "none";
      document.getElementById("cam2-count").style.display = "none";

      cam1Btn.dataset.color = "red";
      cam2Btn.dataset.color = "green";
    } else {
      stopDurationTracking("cam1");
      stopDurationTracking("cam2");

      if (!sendLED("cam1", "red_on")) return;
      if (!sendLED("cam2", "green_on")) return;

      try {
        cam2Check = await checkLed("cam2", cams.cam2.ip, "green");
        if (!cam2Check) {
          failures++;
          openErrorModal("Camera 2 Green LED is not working");
          console.warn("CAM2 green LED check failed");
        }
      } catch (error) {
        if (error.name === "TypeError" || error.message.includes("fetch")) {
          failures++;
          openErrorModal("Camera 2 connection failure");
          console.error("CAM2 critical connection failure:", error);
        }
      }

      try {
        cam1Check = await checkLed("cam1", cams.cam1.ip, "red");
        if (!cam1Check) {
          failures++;
          openErrorModal("Camera 1 Red LED is not working");
          console.warn("CAM1 red LED check failed");
        }
      } catch (error) {
        if (error.name === "TypeError" || error.message.includes("fetch")) {
          failures++;
          openErrorModal("Camera 1 connection failure");
          console.error("CAM1 critical connection failure:", error);
        }
      }

      if (failures >= 2) {
        openErrorModal("Both camera failed");
        return;
      }

      startDurationTracking("cam1", "red");
      startDurationTracking("cam2", "green");

      updateLEDButton("cam1", "red", true);
      updateLEDButton("cam2", "green", true);

      document.getElementById("cam1-count").style.display = "none";
      document.getElementById("cam2-count").style.display = "none";

      cam1Btn.dataset.color = "green";
      cam2Btn.dataset.color = "red";
    }
  });
}

if (cam2Btn) {
  cam2Btn.addEventListener("click", async () => {
    if (!requireCameraAccess("control camera 2")) {
      return;
    }

    if (!cams.cam1.connected || !cams.cam2.connected) {
      openErrorModal(
        "Both cameras must be connected to control traffic lights"
      );
      return;
    }

    if (isAutoModeRunning) {
      return;
    }

    const color = cam2Btn.dataset.color;
    let cam1Check;
    let cam2Check;
    let failures = 0;
    if (color === "green") {
      stopDurationTracking("cam1");
      stopDurationTracking("cam2");

      if (!sendLED("cam2", "green_on")) return;
      if (!sendLED("cam1", "red_on")) return;

      try {
        cam2Check = await checkLed("cam2", cams.cam2.ip, "green");
        if (!cam2Check) {
          openErrorModal("Camera 2 Green LED is not working");
          console.warn("CAM2 green LED check failed");
          failures++;
        }
      } catch (error) {
        if (error.name === "TypeError" || error.message.includes("fetch")) {
          openErrorModal("Camera 2 connection failure");
          console.error("CAM2 critical connection failure:", error);
          failures++;
        }
      }

      try {
        cam1Check = await checkLed("cam1", cams.cam1.ip, "red");
        if (!cam1Check) {
          openErrorModal("Camera 1 Red LED is not working");

          console.warn("CAM1 red LED check failed");
          failures++;
        }
      } catch (error) {
        if (error.name === "TypeError" || error.message.includes("fetch")) {
          openErrorModal("Camera 1 connection failure");
          console.error("CAM1 critical connection failure:", error);
          failures++;
        }
      }

      if (failures >= 2) {
        openErrorModal("Both camera failed");
        return;
      }

      startDurationTracking("cam1", "red");
      startDurationTracking("cam2", "green");

      updateLEDButton("cam1", "red", true);
      updateLEDButton("cam2", "green", true);

      document.getElementById("cam1-count").style.display = "none";
      document.getElementById("cam2-count").style.display = "none";

      cam2Btn.dataset.color = "red";
      cam1Btn.dataset.color = "green";
    } else {
      stopDurationTracking("cam1");
      stopDurationTracking("cam2");

      if (!sendLED("cam2", "red_on")) return;
      if (!sendLED("cam1", "green_on")) return;

      try {
        cam2Check = await checkLed("cam2", cams.cam2.ip, "red");
        if (!cam2Check) {
          openErrorModal("Camera 2 Red LED is not working");
          console.warn("CAM2 red LED check failed");
          failures++;
        }
      } catch (error) {
        if (error.name === "TypeError" || error.message.includes("fetch")) {
          openErrorModal("Camera 2 connection failure");
          console.error("CAM2 critical connection failure:", error);
          failures++;
        }
      }

      try {
        cam1Check = await checkLed("cam1", cams.cam1.ip, "green");
        if (!cam1Check) {
          openErrorModal("Camera 1 Green LED is not working");
          console.warn("CAM1 green LED check failed");
          failures++;
        }
      } catch (error) {
        if (error.name === "TypeError" || error.message.includes("fetch")) {
          openErrorModal("Camera 1 connection failure");
          console.error("CAM2 critical connection failure:", error);
          failures++;
        }
      }

      if (failures >= 2) {
        openErrorModal("Both camera failed");
        return;
      }

      startDurationTracking("cam2", "red");
      startDurationTracking("cam1", "green");

      updateLEDButton("cam1", "green", true);
      updateLEDButton("cam2", "red", true);

      document.getElementById("cam1-count").style.display = "none";
      document.getElementById("cam2-count").style.display = "none";

      cam2Btn.dataset.color = "green";
      cam1Btn.dataset.color = "red";
    }
  });
}

if (IS_ADMIN) {
  const ipAddCamAInput = document.getElementById("ip_address_cam_1");
  const ipAddCamBInput = document.getElementById("ip_address_cam_2");
  const connectCamABtn = document.getElementById("connect-cam-1");
  const connectCamBBtn = document.getElementById("connect-cam-2");
  if(changeIpBtn) {
    changeIpBtn.addEventListener("click", () => {
      
      if(changeIpBtn.type == "button") {
        changeIpBtn.disabled = true;
        setTimeout(() => {
          changeIpBtn.type = "submit";

          ipAddCamAInput.disabled = false;
          ipAddCamBInput.disabled = false;
          connectCamABtn.disabled = false;
          connectCamBBtn.disabled = false;
          cancelChageIpBtn.disabled = false;

        }, 100);
        changeIpBtn.disabled = false;
      }else if (changeIpBtn.type == "submit") {
        changeIpBtn.disabled = true;
        setTimeout(() => {
          
        }, 100);
        changeIpBtn.disabled = false;
      }
    })
  }
  if(cancelChageIpBtn) {
    cancelChageIpBtn.addEventListener("click", () => {
      setTimeout(() => {
        ipAddCamAInput.value = "";
        ipAddCamBInput.value = "";
        ipAddCamAInput.disabled = true;
        ipAddCamBInput.disabled = true;
        connectCamABtn.disabled = true;
        connectCamBBtn.disabled = true;
        cancelChageIpBtn.disabled = true;
        changeIpBtn.type = "button"
        clearFieldError(ipAddCamAInput)
        clearFieldError(ipAddCamBInput)
      }, 100);
    })
  }



  document
    .getElementById("change-ip-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = e.target;
      const formData = new FormData(form);
      const cam1IP = formData.get("ip_address_cam_1");
      const cam2IP = formData.get("ip_address_cam_2");

      const ipPattern =
        /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

      if (!ipPattern.test(cam1IP)) {
        showFieldError(ipAddCamAInput, "Please enter a valid IP address");

        if (!ipPattern.test(cam2IP)) {
          showFieldError(ipAddCamBInput, "Please enter a valid IP address")
        }
        return;
      }

      if (!ipPattern.test(cam2IP)) {
        showFieldError(ipAddCamBInput, "Pleastrue;e enter a valid IP address")
        return;
      }

      if (cam1IP === cam2IP) {
        openErrorModal("Camera 1 and Camera 2 cannot have the same IP address");
        return;
      }

      openConfirmModal({
        title: "Update Camera IP Addresses",
        body: `
        <div class="alert alert-info mb-3">
          <i class="fas fa-info-circle me-2"></i>
          <strong>Confirm IP Address Changes</strong>
        </div>
        <p><strong>Current Settings:</strong></p>
        <ul class="list-unstyled">
          <li><i class="fas fa-camera me-2"></i>Camera 1: <code>${
            cams.cam1.ip || "Not set"
          }</code></li>
          <li><i class="fas fa-camera me-2"></i>Camera 2: <code>${
            cams.cam2.ip || "Not set"
          }</code></li>
        </ul>
        <p><strong>New Settings:</strong></p>
        <ul class="list-unstyled">
          <li><i class="fas fa-camera me-2 text-primary"></i>Camera 1: <code class="text-primary">${cam1IP}</code></li>
          <li><i class="fas fa-camera me-2 text-primary"></i>Camera 2: <code class="text-primary">${cam2IP}</code></li>
        </ul>
        <div class="alert alert-warning mt-3 mb-0">
          <i class="fas fa-exclamation-triangle me-2"></i>
          <small>This will restart camera connections and may temporarily interrupt traffic light control.</small>
        </div>
      `,
        confirmText: "Update IP Addresses",
        cancelText: "Cancel",
        onConfirm: async () => {
          await updateCameraIP(form, formData);
          ipAddCamAInput.value = "";
          ipAddCamBInput.value = "";
          ipAddCamAInput.disabled = true;
          ipAddCamBInput.disabled = true;
          connectCamABtn.disabled = true;
          connectCamBBtn.disabled = true;
          cancelChageIpBtn.disabled = true;
          clearFieldError(ipAddCamAInput)
          clearFieldError(ipAddCamBInput)
          
          changeIpBtn.type = "button";
        },
        onCancel: () => {
          console.log("IP address update cancelled by user");
        },
      });
    });
  setupRealtimeValidation(document.getElementById("change-ip-form"));

  const changeDelayBtn = document.getElementById('change-delay-btn')
  const closeChangeDelayBtn = document.getElementById('close-change-delay-btn')
  const delayInput = document.getElementById('delay-input');

  changeDelayBtn.addEventListener("click", () => {
    if(changeDelayBtn.type == "button") {
      changeDelayBtn.disabled = true;
      setTimeout(() => {
        changeDelayBtn.type = 'submit';

        closeChangeDelayBtn.disabled = false;
        delayInput.disabled = false;
      }, 100);
      changeDelayBtn.disabled = false;
    }
  })

  closeChangeDelayBtn.addEventListener("click", () => {
    setTimeout(() => {
      changeDelayBtn.type = "button";

      closeChangeDelayBtn.disabled = true;
      delayInput.disabled = true;
      delayInput.value = mainDelay;
    }, 100);
  })

  document.getElementById("change-delay-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    
    if(delayInput.value == mainDelay) {
      changeDelayBtn.type = "button";

      closeChangeDelayBtn.disabled = true;
      delayInput.disabled = true;
      delayInput.value = mainDelay;
      return;
    }

    validateDuration(
      delayInput.value,
      () => {
      openInfoModal({
          title: "Update Delay",
          body: `
          <div class="text-center">
              <div class="mb-3">
                  <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
              </div>
              <h5 class="mb-3">Confirm to change the delay</h5>
              <p class="mb-0">Are you sure you want to update delay?</p>
          </div>
          `,
          footer: `
          <button class="btn btn-secondary" onclick="closeInfoModal()">
          <i class="fas fa-times me-1"></i>Close</button>
          <button class="btn btn-danger" id="delay-modal-btn">
          <i class="fas fa-times me-1"></i>Update</button>
          `
        });
      setTimeout(() => {
        const modalCloseBtn = document.querySelector('#infoModal .btn-close');
        const cancelOverrideBtn = document.getElementById('delay-modal-btn');
  
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                closeInfoModal();
            });
        }
        if(cancelOverrideBtn) {
          cancelOverrideBtn.addEventListener("click", () => {
            closeInfoModal()
            setTimeout(() => {
              updateDelay(form, formData)
              
            }, 300)
          })
        }
      }, 100)}
    )
  })
}

async function updateDelay(form, formData) {
  const payload = Object.fromEntries(formData.entries());
  try {
    const response = await fetch(form.action, {
      method: form.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.success) openSuccessModal(data.message);
    else openErrorModal(data.message);
  } catch (err) {
    openErrorModal(err.message);
    console.log(err);
  }
}

if (overrideBtn) {
  overrideBtn.addEventListener("click", (e) => {
    if(overrideBtn.innerText === "Override") {
      openInfoModal({
        title: "Override durations",
        body: `
        <div class="text-center">
            <div class="mb-3">
                <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
            </div>
            <h5 class="mb-3">Confirm Override</h5>
            <p class="mb-0">Are you sure you want to override the duration?</p>
            <p class=" small mb-0">This action will temporarily edit the configured duration</p>
        </div>
        `,
        footer: `
        <button class="btn btn-secondary" onclick="closeInfoModal()">
        <i class="fas fa-times me-1"></i>Close</button>
        <button class="btn btn-danger" id="override-modal-btn">
        <i class="fas fa-edit me-1"></i>Override</button>
        `
      });
      setTimeout(() => {
        const modalCloseBtn = document.querySelector('#infoModal .btn-close');
        const overrideBtn = document.getElementById('override-modal-btn');

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                closeInfoModal();
            });
        }
        if(overrideBtn) {
          overrideBtn.addEventListener("click", () => {
            closeInfoModal()
            setTimeout(() => {
              overrideDuration();
            }, 300)
          })
        }
      }, 100)
    }else {
      openInfoModal({
        title: "Cancel Override",
        body: `
        <div class="text-center">
            <div class="mb-3">
                <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
            </div>
            <h5 class="mb-3">Confirm Override</h5>
            <p class="mb-0">Are you sure you want to cancel overriding?</p>
            <p class=" small mb-0">This action will back the duration input into its original input</p>
        </div>
        `,
        footer: `
        <button class="btn btn-secondary" onclick="closeInfoModal()">
        <i class="fas fa-times me-1"></i>Close</button>
        <button class="btn btn-danger" id="cancel-override-modal-btn">
        <i class="fas fa-times me-1"></i>Cancel Override</button>
        `
      });
      setTimeout(() => {
        const modalCloseBtn = document.querySelector('#infoModal .btn-close');
        const cancelOverrideBtn = document.getElementById('cancel-override-modal-btn');

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                closeInfoModal();
            });
        }
        if(cancelOverrideBtn) {
          cancelOverrideBtn.addEventListener("click", () => {
            closeInfoModal()
            setTimeout(() => {
              backToDefaultDuration();
            }, 300)
          })
        }
      }, 100)
    }
  })
}

function overrideDuration() {
  currentDurationABtn.disabled = false;
  currentDurationBBtn.disabled = false;
  currentDelayBtn.disabled = false;
  
  overrideBtn.innerText = "Back to default";
}

currentDurationABtn.addEventListener('click', () => {
  if(currentDurationABtn.dataset.state === 'edit') {
    currentDurationABtn.dataset.state = 'save'
    currentDurationABtn.innerText = 'Save'
    currentDurationA.disabled = false;
  }else if (currentDurationABtn.dataset.state === 'save') {
    if(currentDurationA.value == currentDurations.durationA) {
      currentDurationABtn.dataset.state = 'edit';
      currentDurationA.disabled = true;
      currentDurationABtn.innerText = 'Edit'
      return;
    }
    validateDuration(
      currentDurationA.value, 
      ()=>{
        currentDurations.durationA = currentDurationA.value; 
        currentDurationABtn.dataset.state = 'edit';
        currentDurationA.disabled = true;
        currentDurationABtn.innerText = 'Edit'
        saveDurationInputState("durationA");
      }
    );
  }
})
currentDurationBBtn.addEventListener('click', () => {
  if(currentDurationBBtn.dataset.state === 'edit') {
    currentDurationBBtn.dataset.state = 'save'
    currentDurationB.disabled = false;
    currentDurationBBtn.innerText = 'Save'
  }else if (currentDurationBBtn.dataset.state === 'save') {
    if(currentDurationB.value == currentDurations.durationB) {
      currentDurationBBtn.dataset.state = 'edit';
      currentDurationB.disabled = true;
      currentDurationBBtn.innerText = 'Edit'
      return;
    }
    validateDuration(
      currentDurationB.value,
      () => {
        currentDurations.durationB = currentDurationB.value; 
        currentDurationBBtn.dataset.state = 'edit';
        currentDurationB.disabled = true;
        currentDurationBBtn.innerText = 'Edit'
        saveDurationInputState("durationB");
      }
    )
  }
})
currentDelayBtn.addEventListener('click', () => {
  if(currentDelayBtn.dataset.state === 'edit') {
    currentDelayBtn.dataset.state = 'save'
    currentDelay.disabled = false;
    currentDelayBtn.innerText = 'Save'
  }else if (currentDelayBtn.dataset.state === 'save') {
    if(currentDelay.value == currentDurations.delay) {
      currentDelayBtn.dataset.state = 'edit';
      currentDelay.disabled = true;
      currentDelayBtn.innerText = 'Edit'
      return;
    }
    validateDuration(
      currentDelay.value,
      () => {
        currentDurations.delay = currentDelay.value; 
        currentDelayBtn.dataset.state = 'edit';
        currentDelay.disabled = true;
        currentDelayBtn.innerText = 'Edit'
        saveDurationInputState("delay");
      }
    )
  }
})
function validateDuration(duration, onSuccess) {
  if(duration >= 60) {
    openInfoModal({
      title: "Duration update",
      body: `
      <div class="text-center">
          <div class="mb-3">
              <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
          </div>
          <h5 class="mb-3">Are you sure to have ${duration} seconds duration?</h5>
      </div>
      `,
      footer: `
      <button class="btn btn-secondary" onclick="closeInfoModal()">
      <i class="fas fa-times me-1"></i>No</button>
      <button class="btn btn-danger" id="validate-duration-modal-btn">
      <i class="fas fa-check me-1"></i>Yes</button>
      `
    });
    setTimeout(() => {
      const modalCloseBtn = document.querySelector('#infoModal .btn-close');
      const cancelOverrideBtn = document.getElementById('validate-duration-modal-btn');

      if (modalCloseBtn) {
          modalCloseBtn.addEventListener('click', () => {
            closeInfoModal();
          });
      }
      if(cancelOverrideBtn) {
        cancelOverrideBtn.addEventListener("click", () => {
          closeInfoModal()
          setTimeout(() => {
            onSuccess();
          }, 300)
        })
      }
    }, 100)
  }else {
    onSuccess();
  }
}

function backToDefaultDuration() {
  currentDurationA.disabled = true;  
  currentDurationB.disabled = true;
  currentDelay.disabled = true;
  currentDurationABtn.disabled = true;
  currentDurationBBtn.disabled = true;
  currentDelayBtn.disabled = true;
  
  overrideBtn.innerText = "Override"
  
  currentDelay.value = mainDelay;
  currentDurationB.value = findDuration(currentWeekDay === 0 ? 7 : currentWeekDay, "b");
  currentDurationA.value = findDuration(currentWeekDay === 0 ? 7 : currentWeekDay, "a");
  clearDurationInputState();
}

if(emergencyBtn) {
  emergencyBtn.addEventListener("click", () => {
    if (!cams.cam1.connected || !cams.cam2.connected) {
      openErrorModal("Both cameras must be connected to start emergency mode");
      return;
    }
    if(emergencyBtn.innerText === "EMERGENCY") {
      openInfoModal({
        title: "Emergency Mode Activation",
        body: `
        <div class="text-center">
            <div class="mb-3">
                <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
            </div>
            <h5 class="mb-3">Activate emergency mode</h5>
            <p class="mb-0">Are you sure you want to activate emergency mode?</p>
            <p class="small mb-0">This action will make traffic lights become red</p>
        </div>
        `,
        footer: `
        <button class="btn btn-secondary" onclick="closeInfoModal()">
        <i class="fas fa-times me-1"></i>Close</button>
        <button class="btn btn-danger" id="emergency-modal-btn">
        <i class="fas fa-times me-1"></i>Activate</button>
        `
      });
      setTimeout(() => {
        const modalCloseBtn = document.querySelector('#infoModal .btn-close');
        const cancelOverrideBtn = document.getElementById('emergency-modal-btn');

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                closeInfoModal();
            });
        }
        if(cancelOverrideBtn) {
          cancelOverrideBtn.addEventListener("click", () => {
            closeInfoModal()
            setTimeout(() => {
              performEmergency();
            }, 300)
          })
        }
      }, 100)
    }else {
      openInfoModal({
        title: "Emergency Mode Cancellation",
        body: `
        <div class="text-center">
            <div class="mb-3">
                <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
            </div>
            <h5 class="mb-3">Cancel emergency mode</h5>
            <p class="mb-0">Are you sure you want to cancel emergency mode?</p>
            <p class="small mb-0">This action will make traffic lights back to its previous state</p>
        </div>
        `,
        footer: `
        <button class="btn btn-secondary" onclick="closeInfoModal()">
        <i class="fas fa-times me-1"></i>Close</button>
        <button class="btn btn-danger" id="cancel-emergency-modal-btn">
        <i class="fas fa-times me-1"></i>Cancel Emergency</button>
        `
      });
      setTimeout(() => {
        const modalCloseBtn = document.querySelector('#infoModal .btn-close');
        const cancelOverrideBtn = document.getElementById('cancel-emergency-modal-btn');

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                closeInfoModal();
            });
        }
        if(cancelOverrideBtn) {
          cancelOverrideBtn.addEventListener("click", () => {
            closeInfoModal()
            setTimeout(() => {
              cancelEmergency();
            }, 300)
          })
        }
      }, 100)
    }
  })
}

function performEmergency() {
  if(isAutoModeRunning) {
    stopAutoMode(true);
  }
  cam1Btn.disabled = true;
  cam2Btn.disabled = true;
  cam1Btn.classList.add("disabled");
  cam2Btn.classList.add("disabled");

  autoModeBtn.disabled = true;
  emergencyBtn.innerText = "Cancel Emergency";
  
  sendLED("cam1", "red_on", true);
  sendLED("cam2", "red_on", true);
  updateLEDButton("cam1", "red", true, false)
  updateLEDButton("cam2", "red", true, false)
  saveEmergencyState();
}

function cancelEmergency() {
  const autoModeState = loadAutoModeState();
  if (autoModeState.isRunning) {
    setTimeout(() => {
      if (cams.cam1.connected && cams.cam2.connected) {
        console.log("Resuming auto mode after page reload");
        resumeAutoModeWithTimer(true);
      } else {
        console.log("Cannot resume auto mode - cameras not connected");
        clearAutoModeState();
        clearTimerState();
        cam1Btn.disabled = false;
        cam2Btn.disabled = false;
        cam1Btn.classList.remove("disabled");
        cam2Btn.classList.remove("disabled");
      }
    }, 3000);
  }else{
    const cam1SavedState = loadLEDState("cam1");
    const cam2SavedState = loadLEDState("cam2");

    if (cam1SavedState && cam1SavedState.isOn) {
      updateLEDButton("cam1", cam1SavedState.color, true, false);
    } else {
      updateLEDButton("cam1", "green", false, false);
    }

    if (cam2SavedState && cam2SavedState.isOn) {
      updateLEDButton("cam2", cam2SavedState.color, true, false);
    } else {
      updateLEDButton("cam2", "red", false, false);
    }
    cam1Btn.disabled = false;
    cam2Btn.disabled = false;
    cam1Btn.classList.remove("disabled");
    cam2Btn.classList.remove("disabled");
  }
  autoModeBtn.disabled = false;
  emergencyBtn.innerText = "EMERGENCY";
  clearEmergencyState();
}

async function updateCameraIP(form, formData) {
  const payload = Object.fromEntries(formData.entries());
  try {
    const response = await fetch(form.action, {
      method: form.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.success) openSuccessModal(data.message);
    else openErrorModal(data.message);
  } catch (err) {
    openErrorModal(err.message);
    console.log(err);
  }
}



// ================================================================
// AUTO MODE SYSTEM
// ================================================================

async function startPhase1(remainingTime = 0){
  if (!sendLED("cam1", "green_on")) return;
  if (!sendLED("cam2", "red_on")) return;

  updateLEDButton("cam1", "green", true, false);
  updateLEDButton("cam2", "red", true, false);

  let criticalFailures = 0;

  try {
    const cam1Check = await checkLed("cam1", cams.cam1.ip, "green");
    if (!cam1Check) {
      openErrorModal("Camera 1 Green LED is not working");
      criticalFailures++;

      console.warn("CAM1 green LED check failed");
    }
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      openErrorModal("Camera 1 connection failure");
      criticalFailures++;
      console.error("CAM1 critical connection failure:", error);
    }
  }

  try {
    const cam2Check = await checkLed("cam2", cams.cam2.ip, "red");
    if (!cam2Check) {
      openErrorModal("Camera 2 Red LED is not working");
      criticalFailures++;
      console.warn("CAM2 red LED check failed");
    }
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      openErrorModal("Camera 2 connection failure");
      criticalFailures++;
      console.error("CAM2 critical connection failure:", error);
    }
  }

  if (criticalFailures >= 2) {
    console.error(
      "Critical failures detected in both cameras, stopping auto mode"
    );
    stopAutoMode();
    openErrorModal(
      "Auto mode stopped due to critical ESP32/LED failures in both cameras"
    );
    return;
  }

  let time = remainingTime === 0 ? parseInt(currentDurations.durationA) : parseInt(remainingTime);

  for (let i = time; i >= 0; i--) {
    if (autoModeController.signal.aborted || !isAutoModeRunning) {
      console.log("Auto mode aborted during countdown");
      return;
    }

    saveTimerState("phase1", i, Date.now());
    const num = await count(i);

    if (autoModeController.signal.aborted || !isAutoModeRunning) {
      console.log("Auto mode aborted after count in phase1");
      return;
    }

    document.getElementById("cam1-count").innerText = num;
  }

  if (!autoModeController.signal.aborted && isAutoModeRunning) {
    logLightChange(
      "cam1",
      "green",
      "auto",
      findDuration(currentWeekDay === 0 ? 7 : currentWeekDay, "a")
    );
    logLightChange(
      "cam2",
      "red",
      "auto",
      findDuration(currentWeekDay === 0 ? 7 : currentWeekDay, "a")
    );
    document.getElementById("cam1-count").innerText = "0";
  }
}

async function startPhase2(remainingTime = 0) {
  if (autoModeController.signal.aborted || !isAutoModeRunning) return;

  sendLED("cam1", "red_on");

  const time = remainingTime === 0 ? parseInt(currentDurations.delay) : parseInt(remainingTime);

  for (let i = time; i >= 0; i--) {
    if (autoModeController.signal.aborted || !isAutoModeRunning) {
      console.log("Auto mode aborted during countdown");
      return;
    }
    saveTimerState("phase2", i, Date.now());
    const num = await count(i);

    if (autoModeController.signal.aborted || !isAutoModeRunning) {
      return;
    }

    document.getElementById("cam1-count").innerText = num;
  }
  document.getElementById("cam1-count").innerText = "0";
}

async function startPhase3(remainingTime = 0) {
  if (autoModeController.signal.aborted || !isAutoModeRunning) return;
  
  if (!sendLED("cam1", "red_on")) return;
  if (!sendLED("cam2", "green_on")) return;

  updateLEDButton("cam1", "red", true, false);
  updateLEDButton("cam2", "green", true, false);

  let criticalFailures = 0;

  try {
    const cam1Check2 = await checkLed("cam1", cams.cam1.ip, "red");
    if (!cam1Check2) {
      openErrorModal("Camera 1 Red LED is not working");
      criticalFailures++;
      console.warn("CAM1 red LED check failed in second phase");
    }
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      criticalFailures++;
      openErrorModal("Camera 1 connection failure");
      console.error(
        "CAM1 critical connection failure in second phase:",
        error
      );
    }
  }

  try {
    const cam2Check2 = await checkLed("cam2", cams.cam2.ip, "green");
    if (!cam2Check2) {
      openErrorModal("Camera 2 Green LED is not working");
      criticalFailures++;
      console.warn("CAM2 green LED check failed in second phase");
    }
  } catch (error) {
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      openErrorModal("Camera 2 connection failure");
      criticalFailures++;
      console.error(
        "CAM2 critical connection failure in second phase:",
        error
      );
    }
  }

  if (criticalFailures >= 2) {
    console.error(
      "Critical failures detected in both cameras (second phase), stopping auto mode"
    );
    stopAutoMode();
    openErrorModal(
      "Auto mode stopped due to critical ESP32/LED failures in both cameras"
    );
    return;
  }

  const time = remainingTime === 0 ? parseInt(currentDurations.durationB) : parseInt(remainingTime);
  
  for (let i = time; i >= 0; i--) {
    if (autoModeController.signal.aborted || !isAutoModeRunning) {
      console.log("Auto mode aborted during second countdown");
      return;
    }

    saveTimerState("phase3", i, Date.now());
    const num = await count(i);
    
    if (autoModeController.signal.aborted || !isAutoModeRunning) {
      return;
    }

    document.getElementById("cam2-count").innerText = num;
  }
  if (!autoModeController.signal.aborted && isAutoModeRunning) {
    logLightChange(
      "cam1",
      "red",
      "auto",
      findDuration(currentWeekDay === 0 ? 7 : currentWeekDay, "b")
    );
    logLightChange(
      "cam2",
      "green",
      "auto",
      findDuration(currentWeekDay === 0 ? 7 : currentWeekDay, "b")
    );
    document.getElementById("cam2-count").innerText = "0";
  }
}

async function startPhase4(remainingTime = 0) {
  if (autoModeController.signal.aborted || !isAutoModeRunning) return;

  sendLED("cam2", "red_on")

  const time = remainingTime === 0 ? parseInt(currentDurations.delay) : parseInt(remainingTime);

  for (let i = time; i >= 0; i--) {
    if (autoModeController.signal.aborted || !isAutoModeRunning) {
      console.log("Auto mode aborted during countdown");
      return;
    }

    saveTimerState("phase4", i, Date.now());
    const num = await count(i);

    if(autoModeController.signal.aborted || !isAutoModeRunning) {
      return;
    }

    document.getElementById("cam2-count").innerText = num;
  }
  document.getElementById("cam2-count").innerText = "0";
}

/**
 * Start automatic traffic light mode with timer
 */
async function startAutoMode() {
  if (!cams.cam1.connected || !cams.cam2.connected) {
    openErrorModal("Both cameras must be connected to start auto mode");
    return;
  }

  autoModeController = new AbortController();
  isAutoModeRunning = true;

  saveAutoModeState(true);

  autoModeBtn.textContent = "Stop Auto Mode";
  autoModeBtn.classList.remove("btn-primary");
  autoModeBtn.classList.add("btn-danger");

  cam1Btn.disabled = true;
  cam2Btn.disabled = true;
  cam1Btn.classList.add("disabled");
  cam2Btn.classList.add("disabled");

  const cam1Count = document.getElementById("cam1-count");
  const cam2Count = document.getElementById("cam2-count");
  cam1Count.style.display = "block";
  cam2Count.style.display = "block";
  cam1Count.innerText = "";
  cam2Count.innerText = "";

  try {
    while (!autoModeController.signal.aborted && isAutoModeRunning) {
      if (autoModeController.signal.aborted || !isAutoModeRunning) {
        console.log("Auto mode aborted");
        break;
      }

      await startPhase1();
      
      if (autoModeController.signal.aborted || !isAutoModeRunning) {
        console.log("Auto mode aborted before second phase");
        break;
      }
      
      await startPhase2();

      if (autoModeController.signal.aborted || !isAutoModeRunning) {
        console.log("Auto mode aborted before second phase");
        break;
      }

      await startPhase3();
      
      if (autoModeController.signal.aborted || !isAutoModeRunning) {
        console.log("Auto mode aborted before second phase");
        break;
      }

      await startPhase4();
    }
  } catch (error) {
    console.error("Auto mode error:", error);
    openErrorModal("Auto mode encountered an error and was stopped");
  } finally {
    if(isAutoModeRunning) stopAutoMode();
  }
}

function stopAutoMode(saved=false) {
  if (autoModeController) {
    autoModeController.abort();
  }

  isAutoModeRunning = false;

  saveAutoModeState(saved);
  if(!saved) clearTimerState();

  const cam1Button = document.getElementById("cam1-button");
  const cam2Button = document.getElementById("cam2-button");

  if (cam1Button && cam1Button.getAttribute("data-state") === "on") {
    const cam1Color = cam1Button.textContent.includes("GREEN")
      ? "green"
      : "red";
    saveLEDState("cam1", cam1Color, true);
  }

  if (cam2Button && cam2Button.getAttribute("data-state") === "on") {
    const cam2Color = cam2Button.textContent.includes("GREEN")
      ? "green"
      : "red";
    saveLEDState("cam2", cam2Color, true);
  }

  autoModeBtn.textContent = "Start automatic";
  autoModeBtn.classList.remove("btn-danger");
  autoModeBtn.classList.add("btn-primary");

  cam1Btn.disabled = false;
  cam2Btn.disabled = false;
  cam1Btn.classList.remove("disabled");
  cam2Btn.classList.remove("disabled");

  document.getElementById("cam1-count").innerText = "";
  document.getElementById("cam2-count").innerText = "";
  document.getElementById("cam1-count").style.display = "none";
  document.getElementById("cam2-count").style.display = "none";
}

async function resumeAutoModeWithTimer(isEmergency=false) {
  const savedTimer = loadTimerState();

  if (!savedTimer) {
    startAutoMode();
    return;
  }

  const remainingTime = isEmergency ? calculateRemainingTime(savedTimer, true) : calculateRemainingTime(savedTimer);

  if (remainingTime <= 0) {
    clearTimerState();

    if (savedTimer.phase === "phase1") {
      continueAutoMode("phase2");
    } else if (savedTimer.phase === "phase2") {
      continueAutoMode("phase3");
    } else if (savedTimer.phase === "phase3") {
      continueAutoMode("phase4");
    }else {
      startAutoMode();
    }
    return;
  }

  autoModeController = new AbortController();
  isAutoModeRunning = true;
  saveAutoModeState(true);

  autoModeBtn.textContent = "Stop Auto Mode";
  autoModeBtn.classList.remove("btn-primary");
  autoModeBtn.classList.add("btn-danger");

  cam1Btn.disabled = true;
  cam2Btn.disabled = true;
  cam1Btn.classList.add("disabled");
  cam2Btn.classList.add("disabled");

  const cam1Count = document.getElementById("cam1-count");
  const cam2Count = document.getElementById("cam2-count");
  cam1Count.style.display = "block";
  cam2Count.style.display = "block";

  console.log(
    `Resuming auto mode from ${savedTimer.phase} with ${remainingTime} seconds remaining`
  );

  try {
    if (savedTimer.phase === "phase1") {
      await startPhase1(remainingTime);

      if (!autoModeController.signal.aborted) {
        await continueAutoMode("phase2");
      }
    }else if (savedTimer.phase === "phase2") {
      await startPhase2(remainingTime);
      if (!autoModeController.signal.aborted) {
        await continueAutoMode("phase3");
      }
    }else if (savedTimer.phase === "phase3") {
      await startPhase3(remainingTime);
      if (!autoModeController.signal.aborted) {
        await continueAutoMode("phase4");
      }
    } else {
      await startPhase4(remainingTime);
    }

    clearTimerState();
    if (!autoModeController.signal.aborted) {
      startAutoMode();
    }
  } catch (error) {
    console.error("Error resuming auto mode:", error);
    stopAutoMode();
    openErrorModal("Auto mode encountered an error and was stopped");
  }
}

async function continueAutoMode(phase) {
  if (!isAutoModeRunning) {
    autoModeController = new AbortController();
    isAutoModeRunning = true;
    saveAutoModeState(true);

    autoModeBtn.textContent = "Stop Auto Mode";
    autoModeBtn.classList.remove("btn-primary");
    autoModeBtn.classList.add("btn-danger");

    cam1Btn.disabled = true;
    cam2Btn.disabled = true;
    cam1Btn.classList.add("disabled");
    cam2Btn.classList.add("disabled");
  }

  if(phase === "phase2") {
    await startPhase2();
    await startPhase3();
    await startPhase4();
  }else if (phase === "phase3") {
    await startPhase3();
    await startPhase4();
  }else if (phase === "phase4") {
    await startPhase4();
  }

  clearTimerState();
  if (!autoModeController.signal.aborted) {
    startAutoMode();
  }
}

if (autoModeBtn) {
  autoModeBtn.addEventListener("click", async () => {
    if (!isAutoModeRunning) {
      openInfoModal({
        title: "Automatic mode activation",
        body: `
        <div class="text-center">
            <div class="mb-3">
                <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
            </div>
            <h5 class="mb-3">Activate automatic mode</h5>
            <p class="mb-0">Are you sure you want to activate automatic mode?</p>
            <p class="small mb-0">This action will make traffic lights be automatic based on the configuration</p>
        </div>
        `,
        footer: `
        <button class="btn btn-secondary" onclick="closeInfoModal()">
        <i class="fas fa-times me-1"></i>Close</button>
        <button class="btn btn-danger" id="activate-auto-modal-btn">
        <i class="fas fa-times me-1"></i>Activate</button>
        `
      });
      setTimeout(() => {
        const modalCloseBtn = document.querySelector('#infoModal .btn-close');
        const cancelOverrideBtn = document.getElementById('activate-auto-modal-btn');

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                closeInfoModal();
            });
        }
        if(cancelOverrideBtn) {
          cancelOverrideBtn.addEventListener("click", () => {
            closeInfoModal()
            setTimeout(async () => {
              await startAutoMode();
            }, 300)
          })
        }
      }, 100)
    }else {
      openInfoModal({
        title: "Automatic mode cancellation",
        body: `
        <div class="text-center">
            <div class="mb-3">
                <i class="fas fa-exclamation-triangle text-warning fa-3x"></i>
            </div>
            <h5 class="mb-3">Cancel automatic mode</h5>
            <p class="mb-0">Are you sure you want to cancel automatic mode?</p>
        </div>
        `,
        footer: `
        <button class="btn btn-secondary" onclick="closeInfoModal()">
        <i class="fas fa-times me-1"></i>Close</button>
        <button class="btn btn-danger" id="activate-auto-modal-btn">
        <i class="fas fa-times me-1"></i>Cancel Automatic Mode</button>
        `
      });
      setTimeout(() => {
        const modalCloseBtn = document.querySelector('#infoModal .btn-close');
        const cancelOverrideBtn = document.getElementById('activate-auto-modal-btn');

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
              closeInfoModal();
            });
        }
        if(cancelOverrideBtn) {
          cancelOverrideBtn.addEventListener("click", () => {
            closeInfoModal()
            setTimeout(() => {
              stopAutoMode();
            }, 300)
          })
        }
      }, 100)
    }
    
  });
}

// ================================================================
// INITIALIZATION AND STARTUP
// ================================================================

/**
 * Initialize the application on page load
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Traffic Light Control System Initializing...");
  cam1Btn.disabled = true;
  cam2Btn.disabled = true;
  let isBtnDisabled;

  initializePrivilegeRestrictions();

  fetch("../user/get-ip.php", { credentials: "include" })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      const { ip_address_1, ip_address_2 } = data["ip_addresses"] || {};

      if (!ip_address_1 || !ip_address_2) {
        openErrorModal(
          "Camera IP addresses are not configured. Please set up IP addresses first."
        );
        return;
      }

      cams.cam1.ip = ip_address_1;
      cams.cam2.ip = ip_address_2;

      connectWebSocket("cam1");
      connectWebSocket("cam2");
    })
    .catch((err) => {
      console.error("Failed to fetch camera IP addresses:", err);
      openErrorModal(
        "Failed to load camera configuration. Please refresh the page."
      );
    });

  fetch("../user/get-delay.php", { credentials: "include" })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    const delay = data["delay"] || {};
    if(IS_ADMIN) delayInput.value = delay;
    mainDelay = delay;
    currentDelay.value = delay;
    currentDurations.delay = delay;
  })
  .catch((err) => {
    console.error("Failed to fetch camera IP addresses:", err);
    openErrorModal(
      "Failed to load camera configuration. Please refresh the page."
    );
  });

  fetch("../user/get_durations.php", { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      durations = data["schedules"];

      const overrideDurationState = loadDurationInputState();
      if (overrideDurationState) {
        currentDurationA.value = overrideDurationState.durationA;
        currentDurationB.value = overrideDurationState.durationB;
        currentDelay.value = overrideDurationState.delay;
        currentDurations.delay = overrideDurationState.delay;
        currentDurations.durationA = overrideDurationState.durationA;
        currentDurations.durationB = overrideDurationState.durationB;
        overrideDuration();
      }else {
        currentDurationA.value = findDuration(
          currentWeekDay === 0 ? 7 : currentWeekDay, "a"
        );
        currentDurationB.value = findDuration(
          currentWeekDay === 0 ? 7 : currentWeekDay, "b"
        );
        currentDurations.durationA = findDuration(
          currentWeekDay === 0 ? 7 : currentWeekDay, "a"
        );
        currentDurations.durationB = findDuration(
          currentWeekDay === 0 ? 7 : currentWeekDay, "b"
        );
      }

      if (durationInputA) {
        const defaultDuration = findDuration(
          1, "a"
        );
        durationInputA.value = defaultDuration || "";
        durationInputA.placeholder = "Duration for today";
      }
      if (durationInputB) {
        const defaultDuration = findDuration(
          1, "b"
        );
        durationInputB.value = defaultDuration || "";
        durationInputB.placeholder = "Duration for today";
      }
    });

  // When page reload, load the previous LED state
  const cam1SavedState = loadLEDState("cam1");
  const cam2SavedState = loadLEDState("cam2");

  if (cam1SavedState && cam1SavedState.isOn) {
    updateLEDButton("cam1", cam1SavedState.color, true, false);
  } else {
    updateLEDButton("cam1", "green", false, false);
  }

  if (cam2SavedState && cam2SavedState.isOn) {
    updateLEDButton("cam2", cam2SavedState.color, true, false);
  } else {
    updateLEDButton("cam2", "red", false, false);
  }


  const emergencyState = loadEmergencyState();
  if(emergencyState && emergencyState.isRunning) {
    setTimeout(()=> {

      if (cams.cam1.connected && cams.cam2.connected) {
        console.log("Resuming auto mode after page reload");
        isBtnDisabled = true;
        performEmergency();
        cam1Btn.disabled = true;
        cam2Btn.disabled = true;
      } else {
        console.log("Cannot resume auto mode - cameras not connected");
        clearEmergencyState();
        cam1Btn.disabled = false;
        cam2Btn.disabled = false;
      }
    }, 2000);
  }else {
    const autoModeState = loadAutoModeState();
    if (autoModeState.isRunning) {
      setTimeout(() => {
        if (cams.cam1.connected && cams.cam2.connected) {
          console.log("Resuming auto mode after page reload");
          resumeAutoModeWithTimer();
          cam1Btn.disabled = true;
          cam2Btn.disabled = true;
        } else {
          console.log("Cannot resume auto mode - cameras not connected");
          clearAutoModeState();
          clearTimerState();
          cam1Btn.disabled = false;
          cam2Btn.disabled = false;
        }
      }, 3000);
    } else {
      document.getElementById("cam1-count").style.display = "none";
      document.getElementById("cam2-count").style.display = "none";
      cam1Btn.disabled = false;
      cam2Btn.disabled = false;
    }
  }
});

window.closeInfoModal = closeInfoModal;
window.performEmergency = performEmergency;
window.overrideDuration = overrideDuration;