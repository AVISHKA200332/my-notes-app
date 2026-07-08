const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, tag } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = await Note.create({
      user: req.user.id,
      title,
      content,
      tag: tag || 'General'
    });

    return res.status(201).json(note);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while creating note' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ date: -1 });
    return res.status(200).json(notes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while fetching notes' });
  }
});

module.exports = router;