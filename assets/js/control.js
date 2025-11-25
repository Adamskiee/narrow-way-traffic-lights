/**
 * Traffic Light Control System
 * Main control module for ESP32-CAM based traffic light management
 * 
 * Features:
 * - Manual LED control with toggle buttons
 * - Automated traffic light cycles with timer persistence
 * - Real-time camera streaming with WebSocket connections
 * - Duration tracking and logging
 * - State persistence across page reloads
 * - ESP32 connection monitoring and error handling
 */

import { handleFormSubmit } from "./formHandler.js";
import { openInfoModal, closeInfoModal } from "./infoModal.js";

// ================================================================
// PRIVILEGE ACCESS CONTROL
// ================================================================

// Get user role from global variables set by PHP
const USER_ROLE = window.userRole || 'operator';
const IS_ADMIN = window.isAdmin || false;
const CAN_CONTROL_CAMERAS = window.canControlCameras || false;

// Privilege check functions
function requireAdmin(action = 'perform this action') {
    if (!IS_ADMIN) {
        showPrivilegeError(`Admin privileges required to ${action}`);
        return false;
    }
    return true;
}

function requireCameraAccess(action = 'control cameras') {
    if (!CAN_CONTROL_CAMERAS) {
        showPrivilegeError(`Camera access required to ${action}`);
        return false;
    }
    return true;
}

function showPrivilegeError(message) {
    // Create and show privilege error modal/alert
    const alert = document.createElement('div');
    alert.className = 'alert alert-warning alert-dismissible fade show privilege-alert';
    alert.innerHTML = `
        <i class="fas fa-lock me-2"></i>
        <strong>Access Denied:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at top of main container
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function initializePrivilegeRestrictions() {
    console.log(`User Role: ${USER_ROLE}, Admin: ${IS_ADMIN}, Camera Access: ${CAN_CONTROL_CAMERAS}`);
    
    if (USER_ROLE === 'operator') {
        const camControls = document.querySelectorAll('.led-control');
        camControls.forEach(control => {
            control.closest('.col').classList.add('cam-controls-operator');
        });
        
        disableAdminFeatures();
    }
}

function disableAdminFeatures() {
    if (autoModeBtn && !IS_ADMIN) {
        autoModeBtn.disabled = true;
        autoModeBtn.classList.add('disabled');
        autoModeBtn.title = 'Admin privileges required';
    }
    
    const weekDayButtons = document.querySelectorAll('#week-days button');
    weekDayButtons.forEach(btn => {
        if (!IS_ADMIN) {
            btn.disabled = true;
            btn.classList.add('disabled');
        }
    });
    
    const ipForm = document.getElementById('change-ip-form');
    if (ipForm && !IS_ADMIN) {
        const inputs = ipForm.querySelectorAll('input, button');
        inputs.forEach(input => {
            input.disabled = true;
        });
    }
    
    if (durationInput && saveDurationBtn && !IS_ADMIN) {
        durationInput.disabled = true;
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
  1: "mon", 2: "tue", 3: "wed", 4: "thu", 
  5: "fri", 6: "sat", 7: "sun"
};

// ================================================================
// DOM ELEMENT REFERENCES
// ================================================================

// Essential control elements
const cam1Btn = document.getElementById("cam1-button");
const cam2Btn = document.getElementById("cam2-button");
const autoModeBtn = document.getElementById("auto-mode-button");

// Duration and scheduling elements
const weekDays = document.getElementById("week-days");
const currentDuration = document.getElementById("current-duration");
const durationInput = document.getElementById("duration-input");
const saveDurationBtn = document.getElementById("save-duration-btn");
const durationResult = document.getElementById("duration-result");

// Form elements
const weekDayDurationEdit = document.getElementById("weekday-duration-edit");
const weekDayDurationAdd = document.getElementById("weekday-duration-add");
const durationFormAdd = document.getElementById("add-weekday-form");
const durationFormEdit = document.getElementById("edit-weekday-form");
const weekDayAdd = document.getElementById("weekday-add");
const weekDayEdit = document.getElementById("weekday-edit");

// Status elements (legacy - may not exist in current UI)
const cam1BtnStatus = document.getElementById("cam1-button-status");
const cam2BtnStatus = document.getElementById("cam2-button-status");
const startButton = document.getElementById("start-traffic-light");

// Validation: Check critical elements
if (!cam1Btn || !cam2Btn || !autoModeBtn) {
  console.error('Critical control elements not found - camera buttons or auto mode button missing');
}

// ================================================================
// GLOBAL STATE MANAGEMENT
// ================================================================

// Current system state
let selectedWeekday = 1; // Default to Monday
let durations = [];
const currentWeekDay = (new Date).getDay();

// Camera connection state
const cams = {
  cam1: { ip: "", ws: null, connected: false },
  cam2: { ip: "", ws: null, connected: false }
};

// LED state tracking for duration logging
let ledStateTimers = {
  cam1: { color: null, startTime: null, duration: 0 },
  cam2: { color: null, startTime: null, duration: 0 }
};

// Manual mode duration tracking intervals
let manualDurationIntervals = {};

// Auto mode state
let isAutoModeRunning = false;
let autoModeController = null;

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Find duration for a specific weekday
 * @param {number} weekDay - Day of week (1-7)
 * @returns {number|undefined} Duration in seconds
 */
function findDuration(weekDay) {
  console.log(`Finding duration for weekday: ${weekDay}`);
  let durationOfDay;
  
  durations.forEach(duration => {
    if (duration["week_day"] == weekDay) {
      durationOfDay = duration["duration"];
      console.log(`Found duration: ${duration["duration"]} seconds`);
    }
  });
  
  console.log(`Final duration: ${durationOfDay}`);
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
// function openErrorModal(message) {
//   openInfoModal("Error", message, "error");
// }

/**
 * Open success modal with message
 * @param {string} message - Success message to display
 */
// function openSuccessModal(message) {
//   openInfoModal("Success", message, "success");
// }

// ================================================================
// DURATION TRACKING SYSTEM
// ================================================================

/**
 * Start tracking LED state duration for logging purposes
 * @param {string} camName - Camera name (cam1 or cam2)
 * @param {string} color - LED color (red or green)
 */
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

/**
 * Stop tracking LED state duration and log to database
 * @param {string} camName - Camera name (cam1 or cam2)
 */
function stopDurationTracking(camName) {
  if (ledStateTimers[camName].startTime) {
    const endTime = Date.now();
    const totalDuration = Math.floor((endTime - ledStateTimers[camName].startTime) / 1000);
    
    // Log the duration to database
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

/**
 * Update duration display for manual mode tracking
 * @param {string} camName - Camera name (cam1 or cam2)
 */
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
    console.log(cameraId, lightState, modeType, duration);
    const response = await fetch('../admin/log-traffic.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        camera_name: cameraId,
        light_color: lightState,
        mode: modeType,
        duration: duration
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

    // Remove auto-refresh to prevent interruptions during normal operation
    setTimeout(() => {
        closeInfoModal();
    }, 5000);
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
    
    setTimeout(() => {
      const savedState = loadLEDState(camName);
      
      if (savedState && savedState.isOn) {
        // Restore saved state
        const command = `${savedState.color}_on`;
        sendLED(camName, command);
        updateLEDButton(camName, savedState.color, true, false);
        console.log(`Restored ${camName} LED state: ${savedState.color}`);
      } else {
        // Default initialization
        if(camName === 'cam1') {
          sendLED('cam1', 'green_on');
          updateLEDButton('cam1', 'green', true);
        } else {
          sendLED('cam2', 'red_on');
          updateLEDButton('cam2', 'red', true);
        }
      }
      
      document.getElementById(`${camName}-error-icon`).style.display = 'none';
    }, 1000); // Wait 1 second before initializing LEDs
    
    console.log(`${camName} WebSocket connected`);
  };

  cam.ws.onmessage = (e) => {
    console.log(`${camName} says:`, e.data);
  };

  cam.ws.onerror = (error) => {
    console.error(`${camName} WebSocket error:`, error);
    cam.connected = false;
    updateStatus(camName, false);
    
    // Update LED button state to show disconnection
    updateLEDButton(camName, 'red', false, false);
    
    // If auto mode is running and both cameras disconnect, stop auto mode
    if (isAutoModeRunning && !cams.cam1.connected && !cams.cam2.connected) {
      console.error('Both cameras disconnected during auto mode, stopping for safety');
      stopAutoMode();
      openErrorModal('Auto mode stopped due to camera disconnections');
    }
  };

  cam.ws.onclose = () => {
    cam.connected = false;
    updateStatus(camName, false);
    
    // Update LED button to show disconnection
    updateLEDButton(camName, 'red', false, false);
    
    console.log(`${camName} WS closed — retrying in 30s`);
    
    // If auto mode is running and both cameras disconnect, stop auto mode
    if (isAutoModeRunning && !cams.cam1.connected && !cams.cam2.connected) {
      console.error('Both cameras disconnected during auto mode, stopping for safety');
      stopAutoMode();
      openErrorModal('Auto mode stopped due to camera disconnections');
    }
    
    setTimeout(() => connectWebSocket(camName), 30000);
  };
}

function sendLED(camName, cmd) {
  const cam = cams[camName];
  if (cam.connected && cam.ws && cam.ws.readyState === WebSocket.OPEN) {
    try {
      cam.ws.send(cmd);
      console.log(`Sent to ${camName}: ${cmd}`);
      
      // Extract color from command and save state
      const color = cmd.includes('green') ? 'green' : 'red';
      saveLEDState(camName, color, true);
      
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

function updateStatus(camName, online) {
  const camImage = document.getElementById(camName);
  const errorIcon = document.getElementById(`${camName}-error-icon`);
  const ledButton = document.getElementById(`${camName}-button`);
  
  if (!online) {
    // Update camera stream to gray image
    camImage.src = "../assets/images/gray.png";
    
    // Show error icon
    errorIcon.style.display = 'block';
    
    // Update LED button to show disconnected state
    if (ledButton) {
      ledButton.classList.add('disconnected');
      const ledText = ledButton.querySelector('.led-text');
      if (ledText) {
        ledText.textContent = `${camName.toUpperCase()}: DISCONNECTED`;
      }
    }
    
    console.warn(`${camName} is disconnected - UI updated`);
  } else {
    // Hide error icon when connected
    errorIcon.style.display = 'none';
    
    // Remove disconnected state from LED button
    if (ledButton) {
      ledButton.classList.remove('disconnected');
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
    timestamp: Date.now()
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
 * Clear all LED states from localStorage
 */
function clearLEDStates() {
  localStorage.removeItem('ledState_cam1');
  localStorage.removeItem('ledState_cam2');
}

/**
 * Save auto mode state to localStorage
 * @param {boolean} isRunning - Whether auto mode is running
 */
function saveAutoModeState(isRunning) {
  localStorage.setItem('autoModeRunning', JSON.stringify({
    isRunning: isRunning,
    timestamp: Date.now()
  }));
}

function loadAutoModeState() {
  try {
    const saved = localStorage.getItem('autoModeRunning');
    return saved ? JSON.parse(saved) : { isRunning: false };
  } catch (error) {
    console.warn('Failed to load auto mode state:', error);
    return { isRunning: false };
  }
}

function clearAutoModeState() {
  localStorage.removeItem('autoModeRunning');
}

// Timer State Management
function saveTimerState(phase, timeRemaining, startTime) {
  localStorage.setItem('autoModeTimer', JSON.stringify({
    phase: phase, // 'phase1' (cam1 green, cam2 red) or 'phase2' (cam1 red, cam2 green)
    timeRemaining: timeRemaining,
    startTime: startTime,
    timestamp: Date.now()
  }));
}

function loadTimerState() {
  try {
    const saved = localStorage.getItem('autoModeTimer');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load timer state:', error);
    return null;
  }
}

function clearTimerState() {
  localStorage.removeItem('autoModeTimer');
}

function transferCountdownOnToggle(clickedCam) {
  const cam1Count = document.getElementById("cam1-count");
  const cam2Count = document.getElementById("cam2-count");
  
  // Get current countdown value from either display
  let currentCountdown = 0;
  if (cam1Count.innerText && cam1Count.innerText !== '') {
    currentCountdown = parseInt(cam1Count.innerText) || 0;
  } else if (cam2Count.innerText && cam2Count.innerText !== '') {
    currentCountdown = parseInt(cam2Count.innerText) || 0;
  }
  
  // If there's an active countdown, transfer it to the appropriate side
  if (currentCountdown > 0) {
    if (clickedCam === 'cam1') {
      // Transfer countdown to cam1 side
      cam1Count.innerText = currentCountdown;
      cam2Count.innerText = '';
      // Update timer state to reflect the new phase
      saveTimerState('phase1', currentCountdown, Date.now());
    } else {
      // Transfer countdown to cam2 side
      cam2Count.innerText = currentCountdown;
      cam1Count.innerText = '';
      // Update timer state to reflect the new phase
      saveTimerState('phase2', currentCountdown, Date.now());
    }
  }
}

function calculateRemainingTime(savedTimer) {
  if (!savedTimer) return null;
  
  const elapsed = Math.floor((Date.now() - savedTimer.timestamp) / 1000);
  const remaining = savedTimer.timeRemaining - elapsed;
  
  // Handle edge cases where timer is very close to 0
  if (remaining <= 1) {
    console.log(`Timer very close to expiry: ${remaining}s remaining`);
    return remaining > 0 ? remaining : 0;
  }
  
  return remaining > 0 ? remaining : 0;
}

function updateLEDButton(camName, color, isOn, saveState = true) {
  const button = document.getElementById(`${camName}-button`);
  const ledText = button.querySelector('.led-text');
  
  if (isOn) {
    button.setAttribute('data-state', 'on');
    ledText.textContent = `${camName.toUpperCase()}: ${color.toUpperCase()}`;
    
    // Apply color-specific CSS classes
    if (camName === 'cam1') {
      if (color === 'red') {
        button.classList.add('red-active');
        button.classList.remove('green-active');
      } else {
        button.classList.add('green-active');
        button.classList.remove('red-active');
      }
    } else if (camName === 'cam2') {
      if (color === 'green') {
        button.classList.add('green-active');
        button.classList.remove('red-active');
      } else {
        button.classList.add('red-active');
        button.classList.remove('green-active');
      }
    }
    
    // Update button data-color for proper toggling
    button.dataset.color = color === 'green' ? 'red' : 'green';
  } else {
    button.setAttribute('data-state', 'off');
    ledText.textContent = `${camName.toUpperCase()}: OFF`;
    
    // Remove all color classes when off
    button.classList.remove('red-active', 'green-active');
    
    // Reset button data-color to default
    if (camName === 'cam1') {
      button.dataset.color = 'green';
    } else {
      button.dataset.color = 'red';
    }
  }
  
  // Save state to localStorage
  if (saveState) {
    saveLEDState(camName, color, isOn);
  }
}



// function findDuration(weekDay) {
//   let durationOfDay;
//   console.log(weekDay)
//   durations.forEach(duration => {
//     if(duration["week_day"] == weekDay) {
//       durationOfDay = duration["duration"];
//       console.log(duration["duration"]);
//     }
//   })
//   console.log(durationOfDay)
//   return durationOfDay;
// }

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
    const res = await fetch(`http://${ip}/check-${color}`, {
      method: "GET", 
      headers:{'Content-Type': 'application/json'},
      timeout: 5000 // 5 second timeoutp
    });
    
    if (!res.ok) {
      console.warn(`HTTP ${res.status} when checking ${camName} ${color} LED`);
      return false;
    }
    
    const result = await res.json();

    if(!result.state) {
      console.warn(`${camName} ${color} LED is not working`);
      if (mode === 'auto') {
        openErrorModal(`${color} LED is not working`);
      }
      return false;
    }
    return true;
  }catch(error) {
    console.warn(`Failed to check ${camName} LED status:`, error);
    // Only show error modal in strict auto mode for critical failures
    if (mode === 'auto') {
      openErrorModal(`Failed to check ${camName} LED status`);
    }
    return false;
  }
}

// ================================================================
// EVENT LISTENERS
// ================================================================

// CAM1 Button Event Listener
if (cam1Btn) {
  cam1Btn.addEventListener("click", async() => {
  
  if (!requireCameraAccess('control camera 1')) {
    return;
  }
  
  if (!cams.cam1.connected || !cams.cam2.connected) {
    openErrorModal("Both cameras must be connected to control traffic lights");
    return;
  }
  
  if (isAutoModeRunning) {
    return;
  }
  
  const color = cam1Btn.dataset.color;
  let cam1Check;
  let cam2Check;
  let failures = 0;
  if(color === "green") {
    
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');

    sendLED('cam1', 'green_on');
    sendLED('cam2', 'red_on');
    try {
      cam2Check = await checkLed("cam2", cams.cam2.ip, "red", "manual");
      if (!cam2Check) {
        failures++;
        openErrorModal("Camera 2 Red LED is not working");
        console.warn("CAM2 red LED check failed");
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        failures++;
        openErrorModal("Camera 2 connection failure");
        console.error("CAM2 critical connection failure:", error);
      }
    }

    try {
      cam1Check = await checkLed("cam1", cams.cam1.ip, "green", "manual");
      if (!cam1Check) {
        failures++;
        openErrorModal("Camera 1 Green LED is not working");
        console.warn("CAM1 green LED check failed");
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        failures++;
        openErrorModal("Camera 1 connection failure");
        console.error("CAM1 critical connection failure:", error);
      }
    }
    
    if(failures >= 2 ) {
      openErrorModal("Both camera failed");
      return;
    }

    startDurationTracking('cam1', 'green');
    startDurationTracking('cam2', 'red');

    updateLEDButton('cam1', 'green', true);
    updateLEDButton('cam2', 'red', true);
    
    document.getElementById("cam1-count").style.display = 'none';
    document.getElementById("cam2-count").style.display = 'none';
    
    cam1Btn.dataset.color = "red";
    cam2Btn.dataset.color = "green";
    if (cam1BtnStatus) cam1BtnStatus.innerText = "Green Light";
    if (cam2BtnStatus) cam2BtnStatus.innerText = "Red Light";
  }else {
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');
    
    sendLED('cam1', 'red_on');
    sendLED('cam2', 'green_on');

    try {
      cam2Check = await checkLed("cam2", cams.cam2.ip, "green", "manual");
      if (!cam2Check) {
        failures++;
        openErrorModal("Camera 2 Green LED is not working");
        console.warn("CAM2 green LED check failed");
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        failures++;
        openErrorModal("Camera 2 connection failure");
        console.error("CAM2 critical connection failure:", error);
      }
    }

    try {
      cam1Check = await checkLed("cam1", cams.cam1.ip, "red", "manual");
      if (!cam1Check) {
        failures++;
        openErrorModal("Camera 1 Red LED is not working");
        console.warn("CAM1 red LED check failed");
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        failures++;
        openErrorModal("Camera 1 connection failure");
        console.error("CAM1 critical connection failure:", error);
      }
    }

    if(failures >= 2 ) {
      openErrorModal("Both camera failed");
      return;
    }

    startDurationTracking('cam1', 'red');
    startDurationTracking('cam2', 'green');

    updateLEDButton('cam1', 'red', true);
    updateLEDButton('cam2', 'green', true);
    
    document.getElementById("cam1-count").style.display = 'none';
    document.getElementById("cam2-count").style.display = 'none';
    
    cam1Btn.dataset.color = "green";
    cam2Btn.dataset.color = "red";
    if (cam1BtnStatus) cam1BtnStatus.innerText = "Red Light";
    if (cam2BtnStatus) cam2BtnStatus.innerText = "Green Light";
  }

  
  });
}

// CAM2 Button Event Listener
if (cam2Btn) {
  cam2Btn.addEventListener("click", async() => {
  // Check camera access privileges first
  if (!requireCameraAccess('control camera 2')) {
    return;
  }
  
  // Check if cameras are connected before proceeding
  if (!cams.cam1.connected || !cams.cam2.connected) {
    openErrorModal("Both cameras must be connected to control traffic lights");
    return;
  }
  
  // Buttons are disabled during auto mode, so this shouldn't execute
  if (isAutoModeRunning) {
    return;
  }
  
  const color = cam2Btn.dataset.color;
  let cam1Check;
  let cam2Check;
  let failures = 0;
  if(color === "green") {
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');
    
    sendLED('cam2', 'green_on');
    sendLED('cam1', 'red_on');
    
    // Check LEDs in background without blocking operation
    try {
      cam2Check = await checkLed("cam2", cams.cam2.ip, "green", "manual");
      if (!cam2Check) {
        openErrorModal("Camera 2 Green LED is not working");
        console.warn("CAM2 green LED check failed");
        failures++;
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        openErrorModal("Camera 2 connection failure");
        console.error("CAM2 critical connection failure:", error);
        failures++;
      }
    }

    try {
      cam1Check = await checkLed("cam1", cams.cam1.ip, "red", "manual");
      if (!cam1Check) {
        openErrorModal("Camera 1 Red LED is not working");
        
        console.warn("CAM1 red LED check failed");
        failures++;
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        openErrorModal("Camera 1 connection failure");
        console.error("CAM1 critical connection failure:", error);
        failures++;
      }
    }

    if(failures >= 2) {
      openErrorModal("Both camera failed");
      return;
    }

    startDurationTracking('cam1', 'red');
    startDurationTracking('cam2', 'green');
    
    // Update button states
    updateLEDButton('cam1', 'red', true);
    updateLEDButton('cam2', 'green', true);

    // Hide countdown in manual mode
    document.getElementById("cam1-count").style.display = 'none';
    document.getElementById("cam2-count").style.display = 'none';
    
    cam2Btn.dataset.color = "red";
    cam1Btn.dataset.color = "green";
    if (cam1BtnStatus) cam1BtnStatus.innerText = "Red Light";
    if (cam2BtnStatus) cam2BtnStatus.innerText = "Green Light";
  }else {
    stopDurationTracking('cam1');
    stopDurationTracking('cam2');

    sendLED('cam2', 'red_on');
    sendLED('cam1', 'green_on');

    // Check LEDs in background without blocking operation

    try {
      cam2Check = await checkLed("cam2", cams.cam2.ip, "red", "manual");
      if (!cam2Check) {
        openErrorModal("Camera 2 Red LED is not working");
        console.warn("CAM2 red LED check failed");;
        failures++
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        openErrorModal("Camera 2 connection failure");
        console.error("CAM2 critical connection failure:", error);
        failures++;
      }
    }

    try {
      cam1Check = await checkLed("cam1", cams.cam1.ip, "green", "manual");
      if (!cam1Check) {
        openErrorModal("Camera 1 Green LED is not working");
        console.warn("CAM1 green LED check failed");
        failures++;
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        openErrorModal("Camera 1 connection failure");
        console.error("CAM2 critical connection failure:", error);
        failures++;
      }
    }

    if(failures >= 2) {
      openErrorModal("Both camera failed");
      return;
    }

    startDurationTracking('cam2', 'red');
    startDurationTracking('cam1', 'green');
    
    // Update button states
    updateLEDButton('cam1', 'green', true);
    updateLEDButton('cam2', 'red', true);
    
    // Hide countdown in manual mode
    document.getElementById("cam1-count").style.display = 'none';
    document.getElementById("cam2-count").style.display = 'none';
    
    cam2Btn.dataset.color = "green";
    cam1Btn.dataset.color = "red";
    if (cam1BtnStatus) cam1BtnStatus.innerText = "Green Light";
    if (cam2BtnStatus) cam2BtnStatus.innerText = "Red Light";
  }
  });
}

// Form submission handler
handleFormSubmit("change-ip-form",
  (data) => (openSuccessModal(data.message)),
  (error) => (openErrorModal(error.message)),
);


// ================================================================
// AUTO MODE SYSTEM
// ================================================================

/**
 * Start automatic traffic light mode with timer persistence
 */
async function startAutoMode() {
  // Check if cameras are connected before starting auto mode
  if (!cams.cam1.connected || !cams.cam2.connected) {
    openErrorModal("Both cameras must be connected to start auto mode");
    return;
  }
  
  autoModeController = new AbortController();
  isAutoModeRunning = true;
  
  // Save auto mode state
  saveAutoModeState(true);
  
  // Update button to show auto mode is running
  autoModeBtn.textContent = "Stop Auto Mode";
  autoModeBtn.classList.remove("btn-primary");
  autoModeBtn.classList.add("btn-danger");
  
  // Disable toggle buttons during auto mode
  cam1Btn.disabled = true;
  cam2Btn.disabled = true;
  cam1Btn.classList.add('disabled');
  cam2Btn.classList.add('disabled');
  
  // Show countdown displays in auto mode
  const cam1Count = document.getElementById("cam1-count");
  const cam2Count = document.getElementById("cam2-count");
  cam1Count.style.display = 'block';
  cam2Count.style.display = 'block';
  cam1Count.innerText = '';
  cam2Count.innerText = '';

  try {
    while(!autoModeController.signal.aborted){
      
      if (autoModeController.signal.aborted) {
        console.log("Auto mode aborted");
        break;
      }
      
      sendLED("cam1", "green_on");
      sendLED("cam2", "red_on");
      
      // Update toggle button states during auto mode
      updateLEDButton('cam1', 'green', true, false); // Don't save state in auto mode
      updateLEDButton('cam2', 'red', true, false);
      
      // Check for critical ESP32/LED failures only
      let criticalFailures = 0;
      
      try {
        const cam1Check = await checkLed("cam1", cams.cam1.ip, "green", "background");
        if (!cam1Check) {
          openErrorModal("Camera 1 Green LED is not working");
          criticalFailures++;
          
          console.warn("CAM1 green LED check failed");
        }
      } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
          openErrorModal("Camera 1 connection failure");
          criticalFailures++;
          console.error("CAM1 critical connection failure:", error);
        }
      }
      
      try {
        const cam2Check = await checkLed("cam2", cams.cam2.ip, "red", "background");
        if (!cam2Check) {
          openErrorModal("Camera 2 Red LED is not working");
          criticalFailures++;
          console.warn("CAM2 red LED check failed");
        }
      } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
          openErrorModal("Camera 2 connection failure");
          criticalFailures++;
          console.error("CAM2 critical connection failure:", error);
        }
      }
      
      // Only stop auto mode if both cameras have critical failures
      if (criticalFailures >= 2) {
        console.error("Critical failures detected in both cameras, stopping auto mode");
        stopAutoMode();
        openErrorModal("Auto mode stopped due to critical ESP32/LED failures in both cameras");
        return;
      }

      for (let i = currentDuration.value; i > 0; i--) {
        if (autoModeController.signal.aborted) {
          console.log("Auto mode aborted during countdown");
          return;
        }

        // Save timer state for persistence
        saveTimerState('phase1', i, Date.now());
        
        const num = await count(i);
        document.getElementById("cam1-count").innerText = num;
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
      
      // Update toggle button states during auto mode second phase
      updateLEDButton('cam1', 'red', true, false); // Don't save state in auto mode
      updateLEDButton('cam2', 'green', true, false);

      // Check for critical failures in second phase
      let criticalFailures2 = 0;
      
      try {
        const cam1Check2 = await checkLed("cam1", cams.cam1.ip, "red", "background");
        if (!cam1Check2) {
          openErrorModal("Camera 1 Red LED is not working");
          criticalFailures2++;
          console.warn("CAM1 red LED check failed in second phase");
        }
      } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
          criticalFailures2++;
          openErrorModal("Camera 1 connection failure");
          console.error("CAM1 critical connection failure in second phase:", error);
        }
      }
      
      try {
        const cam2Check2 = await checkLed("cam2", cams.cam2.ip, "green", "background");
        if (!cam2Check2) {
          openErrorModal("Camera 2 Green LED is not working");
          criticalFailures2++;
          console.warn("CAM2 green LED check failed in second phase");
        }
      } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
          openErrorModal("Camera 2 connection failure");
          criticalFailures2++;
          console.error("CAM2 critical connection failure in second phase:", error);
        }
      }
      
      // Only stop if both cameras have critical failures
      if (criticalFailures2 >= 2) {
        console.error("Critical failures detected in both cameras (second phase), stopping auto mode");
        stopAutoMode();
        openErrorModal("Auto mode stopped due to critical ESP32/LED failures in both cameras");
        return;
      }

      for (let i = currentDuration.value; i > 0; i--) {
        if (autoModeController.signal.aborted) {
          console.log("Auto mode aborted during second countdown");
          return;
        }

        // Save timer state for persistence
        saveTimerState('phase2', i, Date.now());
        
        const num = await count(i);
        document.getElementById("cam2-count").innerText = num;
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
  
  // Clear auto mode persistence state
  saveAutoModeState(false);
  clearTimerState();
  
  // Save current LED states before stopping
  const cam1Button = document.getElementById('cam1-button');
  const cam2Button = document.getElementById('cam2-button');
  
  if (cam1Button && cam1Button.getAttribute('data-state') === 'on') {
    const cam1Color = cam1Button.textContent.includes('GREEN') ? 'green' : 'red';
    saveLEDState('cam1', cam1Color, true);
  }
  
  if (cam2Button && cam2Button.getAttribute('data-state') === 'on') {
    const cam2Color = cam2Button.textContent.includes('GREEN') ? 'green' : 'red';
    saveLEDState('cam2', cam2Color, true);
  }
  
  // Reset button
  autoModeBtn.textContent = "Start automatic";
  autoModeBtn.classList.remove("btn-danger");
  autoModeBtn.classList.add("btn-primary");
  
  // Re-enable toggle buttons when auto mode stops
  cam1Btn.disabled = false;
  cam2Btn.disabled = false;
  cam1Btn.classList.remove('disabled');
  cam2Btn.classList.remove('disabled');
  
  // Clear and hide countdown displays
  document.getElementById("cam1-count").innerText = "";
  document.getElementById("cam2-count").innerText = "";
  document.getElementById("cam1-count").style.display = 'none';
  document.getElementById("cam2-count").style.display = 'none';
  
  console.log("Auto mode stopped - LED states saved");
}

// Resume auto mode with saved timer state
async function resumeAutoModeWithTimer() {
  const savedTimer = loadTimerState();
  
  if (!savedTimer) {
    // No saved timer, start normally
    startAutoMode();
    return;
  }
  
  const remainingTime = calculateRemainingTime(savedTimer);
  
  if (remainingTime <= 0) {
    // Timer expired, determine next phase or start new cycle
    console.log(`Timer expired for ${savedTimer.phase}, transitioning...`);
    clearTimerState();
    
    if (savedTimer.phase === 'phase1') {
      // Start phase 2 directly
      continueAutoModePhase2();
    } else {
      // Start new cycle normally
      startAutoMode();
    }
    return;
  }
  
  // Resume from saved state
  autoModeController = new AbortController();
  isAutoModeRunning = true;
  saveAutoModeState(true);
  
  // Update UI
  autoModeBtn.textContent = "Stop Auto Mode";
  autoModeBtn.classList.remove("btn-primary");
  autoModeBtn.classList.add("btn-danger");
  
  // Disable toggle buttons during auto mode
  cam1Btn.disabled = true;
  cam2Btn.disabled = true;
  cam1Btn.classList.add('disabled');
  cam2Btn.classList.add('disabled');
  
  const cam1Count = document.getElementById("cam1-count");
  const cam2Count = document.getElementById("cam2-count");
  cam1Count.style.display = 'block';
  cam2Count.style.display = 'block';
  
  console.log(`Resuming auto mode from ${savedTimer.phase} with ${remainingTime} seconds remaining`);
  
  try {
    if (savedTimer.phase === 'phase1') {
      // Resume phase 1 (cam1 green, cam2 red)
      sendLED("cam1", "green_on");
      sendLED("cam2", "red_on");
      updateLEDButton('cam1', 'green', true, false);
      updateLEDButton('cam2', 'red', true, false);
      
      // Immediately show the current countdown state
      cam1Count.innerText = remainingTime;
      cam2Count.innerText = '';
      
      // Continue countdown from remaining time
      for (let i = remainingTime; i > 0; i--) {
        if (autoModeController.signal.aborted) return;
        saveTimerState('phase1', i, Date.now());
        const num = await count(i);
        cam1Count.innerText = num;
        cam2Count.innerText = ''; // Ensure cam2 countdown is cleared
      }
      
      if (!autoModeController.signal.aborted) {
        logLightChange("cam1", "green", "auto", findDuration(currentWeekDay === 0 ? 7 : currentWeekDay));
        logLightChange("cam2", "red", "auto", findDuration(currentWeekDay === 0 ? 7 : currentWeekDay));
        cam1Count.innerText = "0";
      }
      
      // Continue with phase 2
      if (!autoModeController.signal.aborted) {
        await continueAutoModePhase2();
      }
    } else {
      // Resume phase 2 (cam1 red, cam2 green)
      sendLED("cam1", "red_on");
      sendLED("cam2", "green_on");
      updateLEDButton('cam1', 'red', true, false);
      updateLEDButton('cam2', 'green', true, false);
      
      // Immediately show the current countdown state
      cam1Count.innerText = '';
      cam2Count.innerText = remainingTime;
      
      // Continue countdown from remaining time
      for (let i = remainingTime; i > 0; i--) {
        if (autoModeController.signal.aborted) return;
        saveTimerState('phase2', i, Date.now());
        const num = await count(i);
        cam2Count.innerText = num;
        cam1Count.innerText = ''; // Ensure cam1 countdown is cleared
      }
      
      if (!autoModeController.signal.aborted) {
        logLightChange("cam1", "red", "auto", findDuration(currentWeekDay === 0 ? 7 : currentWeekDay));
        logLightChange("cam2", "green", "auto", findDuration(currentWeekDay === 0 ? 7 : currentWeekDay));
        cam2Count.innerText = "0";
      }
    }
    
    // Continue with normal auto mode cycle
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

// Helper function for phase 2 continuation
async function continueAutoModePhase2() {
  // Initialize auto mode state if not already set
  if (!isAutoModeRunning) {
    autoModeController = new AbortController();
    isAutoModeRunning = true;
    saveAutoModeState(true);
    
    // Update UI
    autoModeBtn.textContent = "Stop Auto Mode";
    autoModeBtn.classList.remove("btn-primary");
    autoModeBtn.classList.add("btn-danger");
    
    // Disable toggle buttons during auto mode
    cam1Btn.disabled = true;
    cam2Btn.disabled = true;
    cam1Btn.classList.add('disabled');
    cam2Btn.classList.add('disabled');
  }
  
  sendLED("cam1", "red_on");
  sendLED("cam2", "green_on");
  updateLEDButton('cam1', 'red', true, false);
  updateLEDButton('cam2', 'green', true, false);
  
  const cam1Count = document.getElementById("cam1-count");
  const cam2Count = document.getElementById("cam2-count");
  
  // Show countdown displays
  cam1Count.style.display = 'block';
  cam2Count.style.display = 'block';
  cam1Count.innerText = '';
  
  for (let i = currentDuration.value; i > 0; i--) {
    if (autoModeController.signal.aborted) return;
    saveTimerState('phase2', i, Date.now());
    const num = await count(i);
    cam2Count.innerText = num;
    cam1Count.innerText = ''; // Ensure cam1 is cleared
  }
  
  if (!autoModeController.signal.aborted) {
    logLightChange("cam1", "red", "auto", findDuration(currentWeekDay === 0 ? 7 : currentWeekDay));
    logLightChange("cam2", "green", "auto", findDuration(currentWeekDay === 0 ? 7 : currentWeekDay));
    cam2Count.innerText = "0";
  }
  
  // Continue with new cycle
  clearTimerState();
  if (!autoModeController.signal.aborted) {
    startAutoMode();
  }
}

// Auto Mode Button Event Listener
if (autoModeBtn) {
  autoModeBtn.addEventListener("click", async () => {
    // Check admin privileges for automatic mode
    if (!requireAdmin('use automatic mode')) {
      return;
    }
    
    if (!isAutoModeRunning) {
      console.log("Starting auto mode...");
      await startAutoMode();
    } else {
      console.log("Stopping auto mode...");
      stopAutoMode();
    }
  });
}

// ================================================================
// LOGS AND STATISTICS MANAGEMENT
// ================================================================

/**
 * Load recent logs for dashboard display
 */
async function loadRecentLogs() {
  try {
    const response = await fetch('../admin/get-logs-traffic.php?limit=5');
    const data = await response.json();
    
    if (data.success && data.logs) {
      displayRecentLogs(data.logs);
    }
  } catch (error) {
    console.error('Failed to load recent logs:', error);
    const container = document.getElementById('recent-logs-container');
    if (container) {
      container.innerHTML = '<div class="text-muted small">Failed to load recent logs</div>';
    }
  }
}

/**
 * Display recent logs in the dashboard
 * @param {Array} logs - Array of recent log entries
 */
function displayRecentLogs(logs) {
  const container = document.getElementById('recent-logs-container');
  if (!container) return;
  
  if (logs.length === 0) {
    container.innerHTML = '<div class="text-muted small">No recent logs</div>';
    return;
  }
  
  container.innerHTML = logs.map(log => `
    <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
      <div class="flex-grow-1">
        <div class="d-flex align-items-center">
          <span class="badge bg-${log.camera_id === 'cam1' ? 'primary' : 'secondary'} me-2">
            ${log.camera_name}
          </span>
          <span class="badge bg-${log.light_state.toLowerCase() === 'green' ? 'success' : 'danger'} me-2">
            ${log.light_state}
          </span>
          <span class="badge bg-${log.mode_type.toLowerCase() === 'auto' ? 'info' : 'warning'}">
            ${log.mode_type}
          </span>
        </div>
        <div class="small text-muted mt-1">
          ${log.created_at_formatted} • ${log.duration_formatted}
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Load dashboard statistics
 */
async function loadDashboardStats() {
  try {
    const response = await fetch('../admin/get-logs-stats.php');
    const data = await response.json();
    
    if (data.success && data.stats) {
      updateDashboardStats(data.stats);
    }
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
  }
}

/**
 * Update dashboard statistics display
 * @param {Object} stats - Statistics object
 */
function updateDashboardStats(stats) {
  // Update stat counters
  const totalTodayEl = document.getElementById('total-logs-today');
  const autoTodayEl = document.getElementById('auto-mode-today');
  const manualTodayEl = document.getElementById('manual-mode-today');
  const avgDurationEl = document.getElementById('avg-duration-today');
  
  if (totalTodayEl) totalTodayEl.textContent = stats.today_logs || '0';
  
  // Calculate today's auto/manual counts (approximation based on total stats)
  const autoRatio = stats.auto_mode_logs / (stats.total_logs || 1);
  const manualRatio = stats.manual_mode_logs / (stats.total_logs || 1);
  
  if (autoTodayEl) {
    autoTodayEl.textContent = Math.round((stats.today_logs || 0) * autoRatio);
  }
  
  if (manualTodayEl) {
    manualTodayEl.textContent = Math.round((stats.today_logs || 0) * manualRatio);
  }
  
  if (avgDurationEl && stats.average_duration) {
    const avgAuto = stats.average_duration.auto || 0;
    const avgManual = stats.average_duration.manual || 0;
    const overallAvg = (avgAuto + avgManual) / 2;
    avgDurationEl.textContent = overallAvg > 0 ? Math.round(overallAvg) + 's' : 'N/A';
  }
}

/**
 * Refresh dashboard data
 */
function refreshDashboard() {
  loadRecentLogs();
  loadDashboardStats();
}

// ================================================================
// INITIALIZATION AND STARTUP
// ================================================================

/**
 * Initialize the application on page load
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log('Traffic Light Control System Initializing...');
  
  initializePrivilegeRestrictions();
  
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
    
  // Try to initialize LED button states from saved states
  const cam1SavedState = loadLEDState('cam1');
  const cam2SavedState = loadLEDState('cam2');
  
  if (cam1SavedState && cam1SavedState.isOn) {
    updateLEDButton('cam1', cam1SavedState.color, true, false);
  } else {
    updateLEDButton('cam1', 'green', false, false);
  }
  
  if (cam2SavedState && cam2SavedState.isOn) {
    updateLEDButton('cam2', cam2SavedState.color, true, false);
  } else {
    updateLEDButton('cam2', 'red', false, false);
  }
  
  // Check if auto mode was running before page reload
  const autoModeState = loadAutoModeState();
  if (autoModeState.isRunning) {
    // Wait for cameras to connect before resuming auto mode
    setTimeout(() => {
      if (cams.cam1.connected && cams.cam2.connected) {
        console.log('Resuming auto mode after page reload');
        resumeAutoModeWithTimer();
      } else {
        console.log('Cannot resume auto mode - cameras not connected');
        clearAutoModeState();
        clearTimerState();
      }
    }, 3000); // Wait 3 seconds for camera connections
  } else {
    // Hide countdown displays initially (manual mode)
    document.getElementById("cam1-count").style.display = 'none';
    document.getElementById("cam2-count").style.display = 'none';
  }
  
  // Load dashboard logs and statistics
  setTimeout(() => {
    refreshDashboard();
    
    // Set up periodic refresh for dashboard (every 60 seconds)
    setInterval(refreshDashboard, 60000);
  }, 2000); // Wait 2 seconds for initial setup
  
  console.log('Traffic Light Control System Initialized Successfully');
})