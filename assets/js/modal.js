const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("modalClose");

export function openModal({title, body, footer}) {
  modal.classList.remove("hidden");
    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalBody").innerHTML = body;
    document.getElementById("modalFooter").innerHTML = footer;
}

export function closeModal() {
  modal.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", e => {
  if (e.target === modal) closeModal(); // click outside to close
});
