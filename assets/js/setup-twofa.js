const result = document.getElementById("result");

if(document.getElementById('setupTwoFAForm')) {
  document.getElementById('setupTwoFAForm').addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(document.getElementById('setupTwoFAForm'));
    const payload = Object.fromEntries(formData.entries());
    
    try {
      const response = await fetch("./includes/verify-setup-twofa.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      if (data.success) window.location.href = data.redirect;
      else result.innerText = data.message;
    } catch (err) {
      result.innerText = err.message;
      console.log(err);
    }
  })
}
if(document.getElementById('twoFAForm')) {
  document.getElementById('twoFAForm').addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(document.getElementById('twoFAForm'));
      const payload = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("./includes/verify-twofa.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (data.success) window.location.href = data.redirect;
        else result.innerText = data.message;
      } catch (err) {
        result.innerText = err.message;
        console.log(err);
      }
  })
}