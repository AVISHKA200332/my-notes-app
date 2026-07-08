import React, { useState } from 'react';
import { createNote } from '../api/notesApi';

const TAGS = ['General', 'Work', 'Personal', 'Study', 'Ideas'];

function CreateNote({ token, onNoteCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('General');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both the title and the content.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const newNote = await createNote(token, { title, content, tag });
      onNoteCreated(newNote);
      setTitle('');
      setContent('');
      setTag('General');
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="create-note" onSubmit={handleSubmit}>
      <h2>New note</h2>

      <label className="create-note__field">
        <span>Title</span>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
      </label>

      <label className="create-note__field">
        <span>Content</span>
        <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your note here..." />
        <span className="create-note__charcount">{content.length} characters</span>
      </label>

      <label className="create-note__field">
        <span>Tag</span>
        <select value={tag} onChange={(e) => setTag(e.target.value)} className="create-note__select">
          {TAGS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      {error && <p className="create-note__error">{error}</p>}
      {savedFlash && <p className="create-note__success">Note saved ✓</p>}

      <button type="submit" className="btn" disabled={saving}>
        {saving ? 'Saving...' : 'Save note'}
      </button>
    </form>
  );
}

export default CreateNote;