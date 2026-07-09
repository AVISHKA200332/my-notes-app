import { useEffect, useRef } from 'react';

/**
 * Lightweight "Are you sure?" confirmation modal.
 *
 * Props:
 *   noteTitle  {string}   – shown in the confirmation message
 *   onConfirm  {function} – called when user clicks "Delete"
 *   onCancel   {function} – called when user dismisses
 */
function DeleteConfirmModal({ noteTitle, onConfirm, onCancel }) {
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onCancel();
  };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
    >
      <div className="modal modal--compact">
        <div className="modal__delete-icon">🗑</div>
        <h2 className="modal__title" id="delete-modal-title">Delete note?</h2>
        <p className="modal__desc" id="delete-modal-desc">
          <strong>"{noteTitle}"</strong> will be permanently deleted. This cannot be undone.
        </p>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={onConfirm}>
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
