const express = require('express');
const router  = express.Router();
const authMiddleware                              = require('../middleware/authMiddleware');
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');

// All note routes require a valid JWT
router.use(authMiddleware);

router.get('/',     getNotes);    // GET    /api/notes
router.post('/',    createNote);  // POST   /api/notes
router.put('/:id',  updateNote);  // PUT    /api/notes/:id
router.delete('/:id', deleteNote);// DELETE /api/notes/:id

module.exports = router;
