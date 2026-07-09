import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CreateNote from '../components/CreateNote';
import NoteList from '../components/NoteList';
import '../styles/dashboard.css';

const CATEGORIES = ['All', 'Personal', 'School', 'Campus', 'Work'];

function Dashboard() {
  const { token, user, logout } = useAuth();
  const [notes,          setNotes]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search,         setSearch]         = useState('');

  useEffect(() => {
    if (!token) return;

    const loadNotes = async () => {
      try {
        setLoading(true);
        // Use relative path — Vite proxies /api/* → http://localhost:5000
        const res = await fetch('/api/notes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load notes');
        setNotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [token]);

  const noteCount = useMemo(() => notes.length, [notes]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => activeCategory === 'All' || note.category === activeCategory)
      .filter((note) => {
        const query = search.toLowerCase().trim();
        if (!query) return true;
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          (note.category || 'Personal').toLowerCase().includes(query)
        );
      });
  }, [notes, activeCategory, search]);

  const categoriesSummary = useMemo(() => {
    const summary = { Personal: 0, School: 0, Campus: 0, Work: 0 };
    notes.forEach((note) => {
      if (summary[note.category] !== undefined) summary[note.category] += 1;
    });
    return summary;
  }, [notes]);

  return (
    <div className="dashboard">
      {/* ── Hero ── */}
      <div className="dashboard__hero">
        <div>
          <p className="dashboard__eyebrow">Your personal note studio</p>
          <h1 className="dashboard__title">
            Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="dashboard__subtitle">Capture ideas, tasks and moments in one place.</p>
        </div>
        <button className="dashboard__logout" onClick={logout}>Logout</button>
      </div>

      {/* ── Stats ── */}
      <div className="dashboard__stats">
        <article className="dashboard__stat-card">
          <span className="dashboard__stat-label">Saved notes</span>
          <strong className="dashboard__stat-value">{noteCount}</strong>
        </article>
        <article className="dashboard__stat-card">
          <span className="dashboard__stat-label">Active category</span>
          <strong className="dashboard__stat-value">{activeCategory}</strong>
        </article>
        <article className="dashboard__stat-card">
          <span className="dashboard__stat-label">Most recent</span>
          <strong className="dashboard__stat-value">{notes[0]?.title || '—'}</strong>
        </article>
      </div>

      {/* ── Create note ── */}
      <CreateNote
        token={token}
        onNoteCreated={(newNote) => setNotes((prev) => [newNote, ...prev])}
      />

      {/* ── Filters + search ── */}
      <div className="dashboard__toolbar">
        <div className="dashboard__filters">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`dashboard__filter-btn ${
                activeCategory === category ? 'dashboard__filter-btn--active' : ''
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dashboard__search"
          aria-label="Search notes"
        />
      </div>

      {/* ── Note list ── */}
      {loading && <p className="dashboard__status">Loading notes…</p>}
      {error   && <p className="dashboard__status dashboard__status--error">{error}</p>}
      {!loading && !error && <NoteList notes={filteredNotes} />}

      {/* ── Category summary ── */}
      <div className="dashboard__category-summary">
        {Object.entries(categoriesSummary).map(([category, count]) => (
          <div key={category} className="dashboard__category-pill">
            <span>{category}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
