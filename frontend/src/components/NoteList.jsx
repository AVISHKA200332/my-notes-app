function NoteList({ notes }) {
  if (!notes.length) {
    return <p className="notes-list__empty">No notes yet. Create your first one now.</p>;
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <article key={note._id} className="note-card">
          <div className="note-card__head">
            <h3 className="note-card__title">{note.title}</h3>
            <span className={`note-card__category note-card__category--${(note.category || 'Personal').toLowerCase()}`}>
              {note.category || 'Personal'}
            </span>
          </div>
          <p className="note-card__content">{note.content}</p>
          <p className="note-card__date">{new Date(note.createdAt || note.date).toLocaleDateString()}</p>
        </article>
      ))}
    </div>
  );
}

export default NoteList;
