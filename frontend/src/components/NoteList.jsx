import React from 'react';

const ACCENTS = ['accent-red', 'accent-gold', 'accent-cream-deep', 'accent-maroon'];

function getAccent(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
}

function NoteList({ notes }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="notes-list__empty">
        <p>No notes match yet.</p>
        <span>Try a different search or tag, or create your first note above.</span>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note._id} className={`note-card ${getAccent(note._id)}`}>
          <div className="note-card__top">
            <h3 className="note-card__title">{note.title}</h3>
            <span className="note-card__tag">{note.tag || 'General'}</span>
          </div>
          <p className="note-card__content">{note.content}</p>
          <p className="note-card__date">{new Date(note.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default NoteList;