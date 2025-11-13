export async function handleFormSubmit(formId, onSuccess, onError, extendedLogic=()=>{}) {
  console.log("asdfasd")
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    if(extendedLogic(payload) === false) return;
    console.log("hello");
    return;
    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) onSuccess(data);
      else onError(data);
    } catch (err) {
      onError("Request failed.");
      console.log(err);
    }
  });
}
