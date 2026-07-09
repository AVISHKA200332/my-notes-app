import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth }            from '../context/AuthContext';
import { safeFetch }          from '../api/safeFetch';
import CreateNote             from '../components/CreateNote';
import NoteList               from '../components/NoteList';
import EditNoteModal          from '../components/EditNoteModal';
import DeleteConfirmModal     from '../components/DeleteConfirmModal';
import '../styles/dashboard.css';

const CATEGORIES = ['All', 'General', 'Personal', 'School', 'Campus', 'Work'];

function Dashboard() {
  const { token, user, logout } = useAuth();

  const [notes,          setNotes]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search,         setSearch]         = useState('');
  const [editingNote,    setEditingNote]    = useState(null);
  const [deletingNote,   setDeletingNote]   = useState(null);
  const [deleteLoading,  setDeleteLoading]  = useState(false);
  const [deleteError,    setDeleteError]    = useState('');

  // ── Load notes ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await safeFetch('/api/notes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(data ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const noteCount = useMemo(() => notes.length, [notes]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => activeCategory === 'All' || n.tag === activeCategory)
      .filter((n) => {
        const q = search.toLowerCase().trim();
        if (!q) return true;
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.tag || 'General').toLowerCase().includes(q)
        );
      });
  }, [notes, activeCategory, search]);

  const tagSummary = useMemo(() => {
    const counts = { General: 0, Personal: 0, School: 0, Campus: 0, Work: 0 };
    notes.forEach((n) => { if (counts[n.tag] !== undefined) counts[n.tag]++; });
    return counts;
  }, [notes]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleNoteCreated = useCallback(
    (newNote) => setNotes((prev) => [newNote, ...prev]),
    []
  );

  const handleNoteSaved = useCallback((updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingNote) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await safeFetch(`/api/notes/${deletingNote._id}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((n) => n._id !== deletingNote._id));
      setDeletingNote(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* ── Hero ── */}
      <div className="dashboard__hero">
        <div>
          <p className="dashboard__eyebrow">Your personal note studio</p>
          <h1 className="dashboard__title">
            Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="dashboard__subtitle">
            Capture ideas, tasks and moments in one place.
          </p>
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
          <span className="dashboard__stat-label">Active filter</span>
          <strong className="dashboard__stat-value">{activeCategory}</strong>
        </article>
        <article className="dashboard__stat-card">
          <span className="dashboard__stat-label">Most recent</span>
          <strong className="dashboard__stat-value">{notes[0]?.title || '—'}</strong>
        </article>
      </div>

      {/* ── Create note ── */}
      <CreateNote token={token} onNoteCreated={handleNoteCreated} />

      {/* ── Filters + search ── */}
      <div className="dashboard__toolbar">
        <div className="dashboard__filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`dashboard__filter-btn ${
                activeCategory === cat ? 'dashboard__filter-btn--active' : ''
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dashboard__search"
          aria-label="Search notes"
        />
      </div>

      {deleteError && (
        <p className="dashboard__status dashboard__status--error">{deleteError}</p>
      )}

      {loading  && <p className="dashboard__status">Loading notes…</p>}
      {error    && <p className="dashboard__status dashboard__status--error">{error}</p>}
      {!loading && !error && (
        <NoteList
          notes={filteredNotes}
          onEdit={(note)   => setEditingNote(note)}
          onDelete={(note) => { setDeleteError(''); setDeletingNote(note); }}
        />
      )}

      {/* ── Tag summary ── */}
      <div className="dashboard__category-summary">
        {Object.entries(tagSummary).map(([tag, count]) => (
          <div key={tag} className="dashboard__category-pill">
            <span>{tag}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          token={token}
          onSave={handleNoteSaved}
          onClose={() => setEditingNote(null)}
        />
      )}

      {deletingNote && (
        <DeleteConfirmModal
          noteTitle={deletingNote.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingNote(null)}
        />
      )}

      {deleteLoading && (
        <p className="dashboard__status" style={{ textAlign: 'center', marginTop: '1rem' }}>
          Deleting…
        </p>
      )}
    </div>
  );
}

export default Dashboard;
