import { useEffect, useRef, useState } from 'react';

const TAGS = ['General', 'Personal', 'School', 'Campus', 'Work'];

/**
 * Slide-in modal for editing an existing note.
 *
 * Props:
 *   note    {object}   – the note being edited
 *   token   {string}   – JWT for the API call
 *   onSave  {function} – called with the updated note object after success
 *   onClose {function} – called when the modal should be dismissed
 */
function EditNoteModal({ note, token, onSave, onClose }) {
  const [title,   setTitle]   = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tag,     setTag]     = useState(note.tag || 'General');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  const overlayRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/notes/${note._id}`, {
        method:  'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), tag }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update note');

      onSave(data);   // bubble updated note up to Dashboard
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div className="modal">
        {/* Header */}
        <div className="modal__header">
          <div>
            <p className="modal__eyebrow">Editing note</p>
            <h2 className="modal__title" id="edit-modal-title">Update your note</h2>
          </div>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal__form">
          <label className="modal__field">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              autoFocus
            />
          </label>

          <label className="modal__field">
            <span>Content</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note content"
              rows={6}
            />
          </label>

          <label className="modal__field">
            <span>Tag</span>
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              {TAGS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditNoteModal;
