/**
 * NoteList
 *
 * Props:
 *   notes    {array}    – filtered notes to display
 *   onEdit   {function} – called with a note object when Edit is clicked
 *   onDelete {function} – called with a note object when Delete is clicked
 */
function NoteList({ notes, onEdit, onDelete }) {
  if (!notes.length) {
    return (
      <p className="notes-list__empty">
        No notes here yet. Create your first one above ↑
      </p>
    );
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <article key={note._id} className="note-card">
          {/* ── Head: title + tag ── */}
          <div className="note-card__head">
            <h3 className="note-card__title">{note.title}</h3>
            <span className={`note-card__tag note-card__tag--${(note.tag || 'general').toLowerCase()}`}>
              {note.tag || 'General'}
            </span>
          </div>

          {/* ── Body ── */}
          <p className="note-card__content">{note.content}</p>

          {/* ── Footer: date + actions ── */}
          <div className="note-card__footer">
            <span className="note-card__date">
              {new Date(note.date || note.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </span>

            <div className="note-card__actions">
              <button
                className="note-card__btn note-card__btn--edit"
                onClick={() => onEdit(note)}
                aria-label={`Edit note: ${note.title}`}
              >
                ✏ Edit
              </button>
              <button
                className="note-card__btn note-card__btn--delete"
                onClick={() => onDelete(note)}
                aria-label={`Delete note: ${note.title}`}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default NoteList;
