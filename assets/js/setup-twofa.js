import { openInfoModal, closeInfoModal } from "./infoModal.js";
import { validateForm, validateField } from "./validate.js";

const result = document.getElementById("result");
const setupContainer = document.getElementById("setup-container");
const recoveryCodesContainer = document.getElementById("recovery-codes-container");
const recoveryContainer = document.getElementById("recovery-container")
const setupRecoveryContainer = document.getElementById("setup-recovery-container")
const continueBtn = document.getElementById("continue-btn");


const setupTwoFAForm = document.getElementById('setupTwoFAForm');
let codes = [];
if(setupTwoFAForm) {
  setupTwoFAForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(setupTwoFAForm);
    const payload = Object.fromEntries(formData.entries());
    
    const validate = validateField(document.getElementById('code'));
      if(!validate.isValid) {
        return;
      }

    try {
      const response = await fetch("./includes/verify-setup-twofa.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      if (data.success) {
        setupContainer.remove();
        recoveryCodesContainer.classList.remove("hidden");
        localStorage.setItem('activeSetupTwoFApage', "saveRecovery");
        localStorage.setItem('codes', JSON.stringify(data.codes));
        localStorage.setItem('redirect', data.redirect)
        codes = data.codes;
        showRecoveryCode(data.codes);
      } 
      else result.innerText = data.message;
    } catch (err) {
      result.innerText = err.message;
      console.log(err);
    }
  })
}

const setupRecoverTwoFAForm = document.getElementById('setupRecoverTwoFAForm');
if(setupRecoverTwoFAForm) {
  setupRecoverTwoFAForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(setupRecoverTwoFAForm);
    const payload = Object.fromEntries(formData.entries());
    
    const validate = validateField(document.getElementById('code'));
      if(!validate.isValid) {
        return;
      }

    try {
      const response = await fetch("./includes/setup-new-twofa.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.clear();
        openInfoModal({
            title: "Success",
            body: `
                <div class="text-center">
                    <i class="fas fa-check-circle text-success fa-3x mb-3"></i>
                    <p class="mb-0">${data.message}</p>
                </div>
            `,
            footer: `<button type="button" class="btn btn-success" id="closeSuccessModal">Close</button>`
        });
    
        setTimeout(() => {
            const closeBtn = document.getElementById('closeSuccessModal');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    closeInfoModal();
                });
            }
        }, 100);
        
        setTimeout(() => {
            closeInfoModal();
        }, 1500);
        setTimeout(() => {
            window.location.href = data.redirect
        }, 2000);
      } 
      else document.getElementById("result").innerText = data.message;
      console.log(result);
    } catch (err) {
      document.getElementById("result").innerText = err.message;
      console.log(err);
    }
  })
}

const recoverTwoFAForm = document.getElementById('recoverTwoFAForm');
if(recoverTwoFAForm) {
  recoverTwoFAForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(recoverTwoFAForm);
    const payload = Object.fromEntries(formData.entries());
    
    const validate = validateField(document.getElementById('recovery-code'));
      if(!validate.isValid) {
        return;
      }

    try {
      const response = await fetch("./user/verify-recover-twofa.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      if (data.success) {
        setupRecoveryContainer.classList.remove("hidden");
        recoveryContainer.remove();
        localStorage.setItem('activeRecoverySetupTwoFApage', "setupNew");
      } 
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

      const validate = validateField(document.getElementById('code'));
      if(!validate.isValid) {
        return;
      }

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

const downloadCodebtn = document.getElementById("download-code");
if(downloadCodebtn) {
  downloadCodebtn.addEventListener("click", downloadCodesInTxtFile)
}

if(continueBtn) {
  continueBtn.addEventListener("click", () => {
    window.location.href = localStorage.getItem("redirect");
  })
}


function downloadCodesInTxtFile() {
  const serviceName = 'Narrow Way Traffic Lights Website';
  const generationDate = new Date().toLocaleDateString();
  
  // Format the text file content
  let textContent = `BACKUP RECOVERY CODES - ${serviceName}\n`;
  textContent += '=========================================\n\n';
  textContent += `Generated: ${generationDate}\n\n`;
  textContent += 'IMPORTANT: Store these codes in a secure place.\n';
  textContent += 'Each code can be used only once if you lose access to your authenticator app.\n\n';
  textContent += 'YOUR RECOVERY CODES:\n';
  textContent += '-------------------\n';
  
  // Add each code with numbering
  codes.forEach((code, index) => {
    textContent += `${index + 1}. ${code}\n`;
  });
  
  textContent += '\n\n';
  textContent += 'Instructions:\n';
  textContent += '- Keep this file safe and private\n';
  textContent += '- Do not share these codes with anyone\n';
  textContent += '- Use these codes only if you cannot access your authenticator app\n';
  textContent += '- Each code works once\n';
  textContent += '- You can generate new codes in your account security settings\n';
  
  // Create a Blob with the text content
  const blob = new Blob([textContent], { type: 'text/plain' });
  
  // Create a temporary anchor element
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `${serviceName}_Recovery_Codes.txt`;
  
  // Append to body, click, and remove
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // Revoke the object URL
  setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);
}

function showRecoveryCode(codes) {
  const recoveryCodesContainer = document.getElementById("recovery-codes");
  codes.forEach(code => {
    const list = document.createElement("li");
    list.innerText = code;
    recoveryCodesContainer.appendChild(list);
  })
}

function loadCodes() {
  try {
    const saved = localStorage.getItem("codes");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if(setupContainer) {
    const savedCodes = loadCodes();
    if(savedCodes) {
      codes = savedCodes;
      const activePage = localStorage.getItem('activeSetupTwoFApage');
      if(activePage) {
        setupContainer.classList.add("hidden");
        recoveryCodesContainer.classList.remove("hidden");
      }
      showRecoveryCode(savedCodes);
    }
  }

  if(recoveryContainer) {
    if(localStorage.getItem('activeRecoverySetupTwoFApage')) {
      setupRecoveryContainer.classList.remove("hidden");
      recoveryContainer.remove();
    }
  }
})