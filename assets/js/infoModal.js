let bsInfoModal = null;
const infoModalEl = document.getElementById('infoModal');

function initInfoModal() {
  if (!infoModalEl) return null;
  if (!bsInfoModal) bsInfoModal = new bootstrap.Modal(infoModalEl);
  return bsInfoModal;
}

/**
 * Opens the info modal.
 * Returns a Promise that resolves when the modal is hidden.
 */
export function openInfoModal({ title = '', body = '', footer = '' } = {}) {
  const m = initInfoModal();
  if (!m) return Promise.resolve();

  infoModalEl.querySelector('#infoModalTitle').textContent = title;
  infoModalEl.querySelector('#infoModalBody').innerHTML = body;
  infoModalEl.querySelector('#infoModalFooter').innerHTML = footer;

  return new Promise(resolve => {
    const onHidden = () => {
      infoModalEl.removeEventListener('hidden.bs.modal', onHidden);
      resolve();
    };
    infoModalEl.addEventListener('hidden.bs.modal', onHidden);
    m.show();
    infoModalEl.addEventListener('shown.bs.modal', () => {
      const btn = infoModalEl.querySelector('.btn-close, button[autofocus]');
      if (btn) btn.focus();
    }, { once: true });
  });
}

export function closeInfoModal() {
  if (!bsInfoModal) return;
  bsInfoModal.hide();
}