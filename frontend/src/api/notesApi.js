const API_URL = 'http://localhost:5000/api/notes';

export async function getNotes(token) {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch notes');
  }
  return res.json();
}

export async function createNote(token, { title, content }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, content })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create note');
  }
  return res.json();
}