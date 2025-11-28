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

/**
 * Open confirmation modal with custom actions
 * @param {Object} options - Modal configuration
 * @param {string} options.title - Modal title
 * @param {string} options.body - Modal body content
 * @param {string} options.confirmText - Confirm button text (default: "Confirm")
 * @param {string} options.cancelText - Cancel button text (default: "Cancel")
 * @param {Function} options.onConfirm - Callback for confirm action
 * @param {Function} options.onCancel - Callback for cancel action (optional)
 */
export function openConfirmModal({
  title = "Confirm Action",
  body = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm = () => {},
  onCancel = () => {}
}) {
  const modalId = "confirmModal";
  
  // Remove existing confirm modal if any
  const existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }

  const modalHTML = `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="${modalId}Label">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${body}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="confirmCancel">
              ${cancelText}
            </button>
            <button type="button" class="btn btn-danger" id="confirmAction">
              ${confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById(modalId);
  const confirmBtn = document.getElementById("confirmAction");
  const cancelBtn = document.getElementById("confirmCancel");

  // Handle confirm action
  confirmBtn.addEventListener("click", () => {
    onConfirm();
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) {
      bsModal.hide();
    }
  });

  // Handle cancel action
  cancelBtn.addEventListener("click", () => {
    onCancel();
  });

  // Clean up modal after it's hidden
  modal.addEventListener("hidden.bs.modal", () => {
    modal.remove();
  });

  // Show the modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}