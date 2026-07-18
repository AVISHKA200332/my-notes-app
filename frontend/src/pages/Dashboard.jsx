import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '../context/AuthContext';

import CreateNote from '../components/CreateNote';
import NoteList from '../components/NoteList';
import EditNoteModal from '../components/EditNoteModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

import '../styles/dashboard.css';

const CATEGORIES = ['All', 'General', 'Personal', 'School', 'Campus', 'Work'];

function Dashboard() {
  const { token, user, logout } = useAuth();

  // ── Notes state ────────────────────────────────────────────────────────────
  const [notes,          setNotes]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');

  // ── Filter/search state ────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('All');
  const [search,         setSearch]         = useState('');

  // ── Modal state ────────────────────────────────────────────────────────────
  const [editingNote,    setEditingNote]    = useState(null); // note object | null
  const [deletingNote,   setDeletingNote]   = useState(null); // note object | null
  const [deleteLoading,  setDeleteLoading]  = useState(false);
  const [deleteError,    setDeleteError]    = useState('');

  // ── Load notes on mount ────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setLoading(true);
        const res  = await fetch('/api/notes', {
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
    notes.forEach((n) => {
      if (counts[n.tag] !== undefined) counts[n.tag]++;
    });
    return counts;
  }, [notes]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  // Called by CreateNote when a new note is saved
  const handleNoteCreated = useCallback(
    (newNote) => setNotes((prev) => [newNote, ...prev]),
    []
  );

  // Called by EditNoteModal after a successful PUT
  const handleNoteSaved = useCallback((updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  }, []);

  // Called when user clicks Delete and confirms
  const handleDeleteConfirm = async () => {
    if (!deletingNote) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/notes/${deletingNote._id}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete note');

      // Remove from local state immediately — no re-fetch needed
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
        <div className="dashboard__header-actions">
          <Link to="/credits" className="dashboard__credits-link">Credits</Link>
          <button className="dashboard__logout" onClick={logout}>Logout</button>
        </div>
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

      {/* ── Delete error (shown inline below toolbar) ── */}
      {deleteError && (
        <p className="dashboard__status dashboard__status--error">{deleteError}</p>
      )}

      {/* ── Note list ── */}
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

      {/* ── Edit modal ── */}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          token={token}
          onSave={handleNoteSaved}
          onClose={() => setEditingNote(null)}
        />
      )}

      {/* ── Delete confirm modal ── */}
      {deletingNote && (
        <DeleteConfirmModal
          noteTitle={deletingNote.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingNote(null)}
        />
      )}

      {/* Delete in-progress overlay hint */}
      {deleteLoading && (
        <p className="dashboard__status" style={{ textAlign: 'center', marginTop: '1rem' }}>
          Deleting…
        </p>
      )}
    </div>
  );
}

export default Dashboard;
