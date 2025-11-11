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

// const loginForm = document.getElementById('login-form');
// const changePasswordForm = document.getElementById('change-password-form');

// loginForm.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   const data = Object.fromEntries(new FormData(event.target));

//   const res = await fetch("./includes/login-process.php", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });

//   const result = await res.json();
//   if(result.success) {
//     window.location.href = "./pages/dashboard.php";
//   }
//   event.target.reset();
// })
// changePasswordForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const data = Object.fromEntries(new FormData(event.target));

//   const res = await fetch("./user/change-password.php", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });

//   const result = await res.json();
//   if(result.success) {
//     console.log("Change successfully");
//   }
// })

document.querySelectorAll(".validate-form").forEach(form => {
  form.addEventListener("submit", async (e)=> {
    e.preventDefault();
    
    const data = Object.fromEntries(new FormData(e.target));

    const res = await fetch(form.action, {
      method: form.method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if(result.success) {
      console.log("Successfull");
      console.log(result);
      if(result.redirect) {
        window.location.href = result.redirect;
      }
    }
  })
})