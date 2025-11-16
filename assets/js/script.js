// Connect to WebSocket (port 81 as in ESP32 sketch)
let ws = new WebSocket('ws://10.42.0.76/ws');

ws.onopen = () => console.log('WebSocket connected', ws);
ws.onclose = () => console.log('WebSocket disconnected', ws);
ws.onerror = (err) => console.error('WebSocket error', err);

// Send LED commands
function sendWS(message){
  if(ws.readyState === WebSocket.OPEN){
    ws.send(message);
    console.log('Sent:', message);
  } else {
    console.log('WebSocket not open yet');
  }
}

fetch