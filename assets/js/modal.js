let bsModal = null;
const modalEl = document.getElementById('modal');

if (typeof bootstrap === 'undefined') {
  console.error('Bootstrap is not loaded. Ensure bootstrap.bundle.js is included before modal.js');
}

function initModal() {
  if (!modalEl) return null;
  if (!bsModal) bsModal = new bootstrap.Modal(modalEl);
  return bsModal;
}

export function openModal({ title = '', body = '', footer = '', focusSelector = '.btn-close' } = {}) {
  const m = initModal();
  if (!m) return;
  modalEl.querySelector('#modalTitle').textContent = title;
  modalEl.querySelector('#modalBody').innerHTML = body;
  modalEl.querySelector('#modalFooter').innerHTML = footer;
  m.show();
  modalEl.addEventListener('shown.bs.modal', () => {
    const el = modalEl.querySelector(focusSelector);
    if (el) el.focus();
  }, { once: true });
}

export function closeModal() {
  if (!bsModal) return;
  bsModal.hide();
}