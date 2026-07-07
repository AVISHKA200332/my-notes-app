const Note = require('../models/Note');

// @desc    Get all notes for the logged-in user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  // TODO: Implement get all notes logic
  res.status(501).json({ message: 'Get notes – not yet implemented' });
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res) => {
  // TODO: Implement get single note logic
  res.status(501).json({ message: 'Get note – not yet implemented' });
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  // TODO: Implement create note logic
  res.status(501).json({ message: 'Create note – not yet implemented' });
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  // TODO: Implement update note logic
  res.status(501).json({ message: 'Update note – not yet implemented' });
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  // TODO: Implement delete note logic
  res.status(501).json({ message: 'Delete note – not yet implemented' });
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote };
