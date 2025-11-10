<!DOCTYPE html>
<html>
<head>
  <title>ESP32-CAM Control Panel</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <h1>ESP32-CAM Control Center</h1>

  <div class="camera">
    <h2>Camera 1</h2>
    <img src="http://10.42.0.76/stream" width="480">
    <button onclick="toggleLED('green', true)">GREEN LED ON</button>
    <button onclick="toggleLED('green', false)">GREEN LED OFF</button>
    <button onclick="toggleLED('red', true)">RED LED ON</button>
    <button onclick="toggleLED('red', false)">RED LED OFF</button>
  </div>
  <div id="result"></div>
<!-- 
  <div class="camera">
    <h2>Camera 2</h2>
    <img src="http://10.42.0.131/stream" width="480">
    <button onclick="controlCam(2, 'led_on')">LED ON</button>
    <button onclick="controlCam(2, 'led_off')">LED OFF</button>
  </div> -->

  <script src="./assets/script.js"></script>
</body>
</html>
