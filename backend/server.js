require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const noteRoutes = require('./routes/noteRoutes');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// ---- Connect to MongoDB ----
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ---- My real deliverable: POST and GET notes ----
app.use('/api/notes', noteRoutes);

/*
  =====================================================================
  TEMPORARY DEV-ONLY ROUTE BELOW
  This exists so I (Member 2) can get a valid JWT and test my Create/Read
  routes without waiting for Member 1's real signup/login system.
  DELETE this once the team merges everyone's real code together.
  =====================================================================
*/
app.post('/api/dev/token', async (req, res) => {
  try {
    let user = await User.findOne({ email: 'testuser@example.com' });
    if (!user) {
      user = await User.create({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'not-hashed-this-is-just-for-testing'
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not generate dev token' });
  }
});
/* ===================== END OF DEV-ONLY ROUTE ===================== */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
