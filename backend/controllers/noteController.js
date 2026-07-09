const Note = require('../models/Note');

// ─── GET /api/notes ───────────────────────────────────────────────────────────
// Fetch all notes belonging to the logged-in user, newest first
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ date: -1 });
    return res.status(200).json(notes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while fetching notes' });
  }
};

// ─── POST /api/notes ──────────────────────────────────────────────────────────
// Create a new note for the logged-in user
const createNote = async (req, res) => {
  try {
    const { title, content, tag } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = await Note.create({
      user:    req.user.id,
      title:   title.trim(),
      content: content.trim(),
      tag:     tag || 'General',
    });

    return res.status(201).json(note);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while creating note' });
  }
};

// ─── PUT /api/notes/:id ───────────────────────────────────────────────────────
// Update a note — only the owner can do this
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ownership check — compare ObjectId to logged-in user id
    if (note.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorised to update this note' });
    }

    const { title, content, tag } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    note.title   = title.trim();
    note.content = content.trim();
    if (tag !== undefined) note.tag = tag;

    const updated = await note.save();
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while updating note' });
  }
};

// ─── DELETE /api/notes/:id ────────────────────────────────────────────────────
// Delete a note — only the owner can do this
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ownership check
    if (note.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorised to delete this note' });
    }

    await note.deleteOne();
    return res.status(200).json({ message: 'Note deleted successfully', id: req.params.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while deleting note' });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
