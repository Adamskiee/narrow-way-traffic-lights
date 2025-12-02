export async function handleFormSubmit(formId, onSuccess, onError, extendedLogic=()=>{}) {
  const form = document.getElementById(formId);
  if (!form) return;

  if (form.hasAttribute('data-form-handler')) {
    return; // Exit early if handler already exists
  }

  // Mark form as having a handler
  form.setAttribute('data-form-handler', 'true');
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    if(extendedLogic(payload) === false) return;
    console.log(payload);    
    try {
      const response = await fetch(form.action, {
        credentials: 'include',
        method: form.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) onSuccess(data);
      else onError(data);
    } catch (err) {
      onError(err);
      console.log(err);
    }
  });
}
