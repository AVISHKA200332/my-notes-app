import React, { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotes } from '../api/notesApi';
import CreateNote from '../components/CreateNote';
import NoteList from '../components/NoteList';
import '../styles/dashboard.css';

const PAGE_SIZE = 6;
const ALL_TAGS = ['All', 'General', 'Work', 'Personal', 'Study', 'Ideas'];

function Dashboard() {
  const { token, isLoggedIn, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [activeTag, setActiveTag] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!token) return;
    async function loadNotes() {
      try {
        setLoading(true);
        const data = await getNotes(token);
        setNotes(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, [token]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  function handleNoteCreated(newNote) {
    setNotes((prev) => [newNote, ...prev]);
    setPage(1);
  }

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (activeTag !== 'All') {
      result = result.filter((n) => (n.tag || 'General') === activeTag);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const diff = new Date(b.date) - new Date(a.date);
      return sortOrder === 'newest' ? diff : -diff;
    });

    return result;
  }, [notes, search, sortOrder, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filteredNotes.length / PAGE_SIZE));
  const pageNotes = filteredNotes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goToPage(n) {
    setPage(Math.min(Math.max(1, n), totalPages));
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="dashboard__eyebrow">Welcome back</p>
          <h1>My Notes</h1>
        </div>
        <button className="btn btn--ghost" onClick={logout}>Log out</button>
      </header>

      <CreateNote token={token} onNoteCreated={handleNoteCreated} />

      <div className="tag-filter">
        {ALL_TAGS.map((t) => (
          <button
            key={t}
            className={`tag-filter__chip ${activeTag === t ? 'tag-filter__chip--active' : ''}`}
            onClick={() => { setActiveTag(t); setPage(1); }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="notes-toolbar">
        <input
          type="text"
          className="notes-toolbar__search"
          placeholder="Search your notes..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="notes-toolbar__right">
          <span className="notes-toolbar__count">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
          </span>
          <button
            className="btn btn--ghost btn--small"
            onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
          >
            {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
          </button>
        </div>
      </div>

      {loading && <p className="dashboard__status">Loading notes...</p>}
      {error && <p className="dashboard__status dashboard__status--error">{error}</p>}
      {!loading && !error && <NoteList notes={pageNotes} />}

      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn--ghost btn--small" onClick={() => goToPage(page - 1)} disabled={page === 1}>
            Previous
          </button>
          <span className="pagination__label">Page {page} of {totalPages}</span>
          <button className="btn btn--ghost btn--small" onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;