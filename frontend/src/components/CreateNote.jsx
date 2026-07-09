import { useState } from 'react';
import { safeFetch } from '../api/safeFetch';

const CATEGORIES = ['Personal', 'School', 'Campus', 'Work'];

function CreateNote({ token, onNoteCreated }) {
  const [title,    setTitle]    = useState('');
  const [content,  setContent]  = useState('');
  const [category, setCategory] = useState('Personal');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await safeFetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tag: category }),
      });

      onNoteCreated?.(data);
      setTitle('');
      setContent('');
      setCategory('Personal');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create-note">
      <div className="create-note__header">
        <div>
          <p className="create-note__eyebrow">New note</p>
          <h2 className="create-note__title">Capture your next idea</h2>
        </div>
        <span className="create-note__hint">Choose a category and save it instantly.</span>
      </div>

      <form onSubmit={handleSubmit} className="create-note__form">
        <label className="create-note__field">
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a title"
          />
        </label>

        <label className="create-note__field">
          <span>Note</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write down the details"
            rows={4}
          />
        </label>

        <label className="create-note__field">
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        {error && <p className="create-note__error">{error}</p>}

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Saving note…' : 'Add Note'}
        </button>
      </form>
    </section>
  );
}

export default CreateNote;
