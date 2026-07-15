import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './TutorialPage.module.css';

/* ── Copy button component ── */
const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeTopBar}>
        <span className={styles.codeLabel}>code</span>
        <button
          className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
          onClick={handleCopy}
          aria-label="Copy code"
          title="Copy to clipboard"
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre className={styles.code}><code>{code}</code></pre>
    </div>
  );
};

/* ── All tutorial sections ── */
const sections = [
  {
    id: 'what',
    emoji: '🤔',
    title: 'What Are We Building?',
    color: '#fde68a',
    steps: [
      {
        icon: '📓',
        heading: 'A Notes App!',
        body: 'We are building a website where you can write down your notes, save them, edit them, and delete them. It is like a digital notebook that remembers everything for you!',
      },
      {
        icon: '👤',
        heading: 'Every person gets their own notes',
        body: 'You create an account with your email and a password. Then only YOU can see your notes. Nobody else can read them!',
      },
      {
        icon: '💻',
        heading: 'Two parts work together',
        body: 'The app has a FRONTEND (what you see on screen — buttons, pages, colours) and a BACKEND (the hidden brain that saves your notes to a database). Think of it like a restaurant: the frontend is the dining room, the backend is the kitchen!',
      },
    ],
  },
  {
    id: 'tools',
    emoji: '🧰',
    title: 'Tools We Use',
    color: '#bbf7d0',
    steps: [
      {
        icon: '⚛️',
        heading: 'React — builds the screens',
        body: 'React is a free tool made by Facebook. It lets us build the pages you see — the login page, the notes page, buttons, forms. We write code and React turns it into a nice-looking website.',
        tag: 'Frontend',
        tagColor: '#3b82f6',
      },
      {
        icon: '⚡',
        heading: 'Vite — starts our project fast',
        body: 'Vite is like a super-fast rocket launcher for React projects. It sets everything up for us so we can start coding straight away.',
        tag: 'Frontend',
        tagColor: '#3b82f6',
      },
      {
        icon: '🟩',
        heading: 'Node.js — runs JavaScript on the server',
        body: 'Normally JavaScript runs in your browser. Node.js lets us run JavaScript on a computer (server) so we can build the backend too. One language for everything!',
        tag: 'Backend',
        tagColor: '#10b981',
      },
      {
        icon: '🚂',
        heading: 'Express — handles requests',
        body: 'Express is a helper for Node.js. When your browser asks "give me my notes", Express listens and sends back the right answer.',
        tag: 'Backend',
        tagColor: '#10b981',
      },
      {
        icon: '🍃',
        heading: 'MongoDB — saves all the data',
        body: 'MongoDB is a database — it is like a giant notebook on the server that never forgets. Every note and every user account is saved here.',
        tag: 'Database',
        tagColor: '#f59e0b',
      },
    ],
  },
  {
    id: 'step1',
    emoji: '1️⃣',
    title: 'Step 1 — Install the Tools',
    color: '#e0e7ff',
    steps: [
      {
        icon: '📥',
        heading: 'Install Node.js',
        body: 'Go to nodejs.org and download Node.js. Install it like any normal program. This also installs "npm" which is like an app store for code tools.',
        code: '👉 Download from: https://nodejs.org',
      },
      {
        icon: '📝',
        heading: 'Install VS Code (code editor)',
        body: 'VS Code is the program we write our code in. It is free! Download it from code.visualstudio.com and install it.',
        code: '👉 Download from: https://code.visualstudio.com',
      },
      {
        icon: '✅',
        heading: 'Check everything is working',
        body: 'Open a Terminal (or Command Prompt) and type these commands. If you see version numbers, everything is installed correctly!',
        code: 'node --version\nnpm --version',
      },
    ],
  },
  {
    id: 'step2',
    emoji: '2️⃣',
    title: 'Step 2 — Create the Project Folders',
    color: '#fce7f3',
    steps: [
      {
        icon: '📁',
        heading: 'Make a main folder',
        body: 'Create a folder on your computer called "my-notes-app". This is the home for our whole project. Open this folder in VS Code.',
        code: 'mkdir my-notes-app\ncd my-notes-app',
      },
      {
        icon: '⚛️',
        heading: 'Create the Frontend (React)',
        body: 'Inside the main folder, run this command. It creates a "frontend" folder with all the React starter files ready to go.',
        code: 'npm create vite@latest frontend -- --template react\ncd frontend\nnpm install',
      },
      {
        icon: '🟩',
        heading: 'Create the Backend (Node.js)',
        body: 'Go back to the main folder and create a "backend" folder. Then set it up as a Node.js project.',
        code: 'cd ..\nmkdir backend\ncd backend\nnpm init -y',
      },
      {
        icon: '📦',
        heading: 'Install Backend packages',
        body: 'These are the extra tools our backend needs. Copy and run this one command to install all of them at once.',
        code: 'npm install express mongoose bcryptjs jsonwebtoken dotenv cors express-validator',
      },
    ],
  },
  {
    id: 'step3',
    emoji: '3️⃣',
    title: 'Step 3 — Set Up the Database',
    color: '#d1fae5',
    steps: [
      {
        icon: '☁️',
        heading: 'Create a free MongoDB account',
        body: 'Go to mongodb.com/atlas and sign up for free. Create a new project and a free cluster (a cluster is just a cloud database). It will give you a connection string — copy it, you will need it soon!',
        code: '👉 Sign up free at: https://www.mongodb.com/atlas',
      },
      {
        icon: '🔒',
        heading: 'Create a .env file (secret settings)',
        body: 'In your backend folder, create a file called ".env". This file stores secret information like passwords. Never share this file with anyone!',
        code: '# backend/.env\nPORT=5000\nMONGO_URI=your_mongodb_connection_string_here\nJWT_SECRET=make_up_any_long_random_secret_here',
      },
      {
        icon: '🔌',
        heading: 'Connect to the database (db.js)',
        body: 'Create a file: backend/config/db.js — This code connects our app to MongoDB when it starts.',
        code: "const mongoose = require('mongoose');\n\nconst connectDB = async () => {\n  const conn = await mongoose.connect(process.env.MONGO_URI);\n  console.log('MongoDB Connected!');\n};\n\nmodule.exports = connectDB;",
      },
    ],
  },
  {
    id: 'step4',
    emoji: '4️⃣',
    title: 'Step 4 — Build the Backend',
    color: '#fef3c7',
    steps: [
      {
        icon: '👤',
        heading: 'Create the User model (User.js)',
        body: 'Create file: backend/models/User.js — A "model" describes the shape of data. This says every user has a name, email, and password.',
        code: "const mongoose = require('mongoose');\n\nconst userSchema = new mongoose.Schema({\n  name:     { type: String,  required: true },\n  email:    { type: String,  required: true, unique: true },\n  password: { type: String,  required: true },\n});\n\nmodule.exports = mongoose.model('User', userSchema);",
      },
      {
        icon: '📄',
        heading: 'Create the Note model (Note.js)',
        body: 'Create file: backend/models/Note.js — Each note has a title, content, and knows which user it belongs to.',
        code: "const mongoose = require('mongoose');\n\nconst noteSchema = new mongoose.Schema({\n  title:   { type: String, required: true },\n  content: { type: String, required: true },\n  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n}, { timestamps: true });\n\nmodule.exports = mongoose.model('Note', noteSchema);",
      },
      {
        icon: '🔐',
        heading: 'Create the Auth controller (authController.js)',
        body: 'Create file: backend/controllers/authController.js — This handles Register and Login. Passwords are scrambled (hashed) before saving so nobody can read them.',
        code: "const User    = require('../models/User');\nconst bcrypt  = require('bcryptjs');\nconst jwt     = require('jsonwebtoken');\n\n// REGISTER a new user\nconst registerUser = async (req, res) => {\n  const { name, email, password } = req.body;\n  const hashed = await bcrypt.hash(password, 10); // scramble password!\n  const user   = await User.create({ name, email, password: hashed });\n  res.status(201).json({ message: 'Account created!' });\n};\n\n// LOGIN an existing user\nconst loginUser = async (req, res) => {\n  const { email, password } = req.body;\n  const user  = await User.findOne({ email });\n  const match = await bcrypt.compare(password, user.password);\n  if (!match) return res.status(401).json({ message: 'Wrong password!' });\n  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });\n  res.json({ token, name: user.name });\n};\n\nmodule.exports = { registerUser, loginUser };",
      },
      {
        icon: '📒',
        heading: 'Create the Notes controller (noteController.js)',
        body: 'Create file: backend/controllers/noteController.js — The four actions: Get all notes, Create a note, Update a note, Delete a note.',
        code: "const Note = require('../models/Note');\n\nconst getNotes    = async (req, res) => {\n  const notes = await Note.find({ userId: req.user._id });\n  res.json(notes);\n};\n\nconst createNote  = async (req, res) => {\n  const note = await Note.create({ ...req.body, userId: req.user._id });\n  res.status(201).json(note);\n};\n\nconst updateNote  = async (req, res) => {\n  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });\n  res.json(note);\n};\n\nconst deleteNote  = async (req, res) => {\n  await Note.findByIdAndDelete(req.params.id);\n  res.json({ message: 'Note deleted' });\n};\n\nmodule.exports = { getNotes, createNote, updateNote, deleteNote };",
      },
      {
        icon: '🛡️',
        heading: 'Create the Auth Middleware (authMiddleware.js)',
        body: 'Create file: backend/middleware/authMiddleware.js — This is a "security guard". Before letting anyone see notes, it checks they have a valid login token.',
        code: "const jwt  = require('jsonwebtoken');\nconst User = require('../models/User');\n\nconst protect = async (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ message: 'Please log in first!' });\n  const decoded = jwt.verify(token, process.env.JWT_SECRET);\n  req.user = await User.findById(decoded.id).select('-password');\n  next(); // all good, continue!\n};\n\nmodule.exports = { protect };",
      },
      {
        icon: '🗺️',
        heading: 'Create the Routes',
        body: 'Create backend/routes/authRoutes.js and backend/routes/noteRoutes.js — Routes are like a menu that says "if someone visits this URL, run this function".',
        code: "// authRoutes.js\nrouter.post('/register', registerUser);\nrouter.post('/login',    loginUser);\n\n// noteRoutes.js  (all routes are protected!)\nrouter.get('/',      protect, getNotes);\nrouter.post('/',     protect, createNote);\nrouter.put('/:id',   protect, updateNote);\nrouter.delete('/:id',protect, deleteNote);",
      },
      {
        icon: '🚀',
        heading: 'Create the main server file (server.js)',
        body: 'Create file: backend/server.js — This is the starting point of the whole backend. It connects everything together and starts listening for requests.',
        code: "require('dotenv').config();\nconst express   = require('express');\nconst cors      = require('cors');\nconst connectDB = require('./config/db');\n\nconnectDB(); // connect to MongoDB\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\n\napp.use('/api/auth',  require('./routes/authRoutes'));\napp.use('/api/notes', require('./routes/noteRoutes'));\n\napp.listen(5000, () => console.log('Server running on port 5000! 🚀'));",
      },
    ],
  },
  {
    id: 'step5',
    emoji: '5️⃣',
    title: 'Step 5 — Build the Frontend',
    color: '#ede9fe',
    steps: [
      {
        icon: '🔗',
        heading: 'Install Frontend packages',
        body: 'Go to your frontend folder and install these extra tools. React Router lets us have multiple pages, and Axios sends messages to the backend.',
        code: 'cd frontend\nnpm install react-router-dom axios',
      },
      {
        icon: '📡',
        heading: 'Create Axios Instance (axiosInstance.js)',
        body: 'Create file: frontend/src/api/axiosInstance.js — This sets up Axios to always talk to our backend. It also automatically adds your login token to every request.',
        code: "import axios from 'axios';\n\nconst instance = axios.create({\n  baseURL: 'http://localhost:5000/api',\n});\n\n// Attach the token automatically to every request\ninstance.interceptors.request.use((config) => {\n  const token = localStorage.getItem('token');\n  if (token) config.headers.Authorization = `Bearer ${token}`;\n  return config;\n});\n\nexport default instance;",
      },
      {
        icon: '🧠',
        heading: 'Create Auth Context (AuthContext.jsx)',
        body: 'Create file: frontend/src/context/AuthContext.jsx — Context is like a school noticeboard. It holds the "who is logged in?" information and shares it with every page.',
        code: "import { createContext, useContext, useState } from 'react';\nconst AuthContext = createContext();\n\nexport const AuthProvider = ({ children }) => {\n  const [user, setUser] = useState(\n    JSON.parse(localStorage.getItem('user')) || null\n  );\n\n  const login  = (data) => { localStorage.setItem('user', JSON.stringify(data)); setUser(data); };\n  const logout = ()     => { localStorage.removeItem('user'); setUser(null); };\n\n  return (\n    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>\n      {children}\n    </AuthContext.Provider>\n  );\n};\n\nexport const useAuth = () => useContext(AuthContext);",
      },
      {
        icon: '📄',
        heading: 'Create the Pages',
        body: 'Create these three page files. Each one is a screen in the app.',
        code: 'frontend/src/pages/LoginPage.jsx    → Sign in screen\nfrontend/src/pages/RegisterPage.jsx → Create account screen\nfrontend/src/pages/Dashboard.jsx    → Your notes screen',
      },
      {
        icon: '🗺️',
        heading: 'Set up Routing (App.jsx)',
        body: 'Create file: frontend/src/App.jsx — This connects URLs to pages. /login shows LoginPage, /register shows RegisterPage, /dashboard shows the notes.',
        code: "import { Routes, Route, Navigate } from 'react-router-dom';\nimport LoginPage    from './pages/LoginPage';\nimport RegisterPage from './pages/RegisterPage';\nimport Dashboard   from './pages/Dashboard';\n\nfunction App() {\n  return (\n    <Routes>\n      <Route path=\"/\"          element={<Navigate to=\"/login\" />} />\n      <Route path=\"/login\"     element={<LoginPage />} />\n      <Route path=\"/register\"  element={<RegisterPage />} />\n      <Route path=\"/dashboard\" element={<Dashboard />} />\n    </Routes>\n  );\n}\nexport default App;",
      },
    ],
  },
  {
    id: 'step6',
    emoji: '6️⃣',
    title: 'Step 6 — Run the App!',
    color: '#d1fae5',
    steps: [
      {
        icon: '🟩',
        heading: 'Start the Backend',
        body: 'Open a Terminal, go to the backend folder, and run this. You should see "Server running on port 5000" and "MongoDB Connected!"',
        code: 'cd backend\nnode server.js',
      },
      {
        icon: '⚛️',
        heading: 'Start the Frontend',
        body: 'Open a SECOND Terminal, go to the frontend folder, and run this. It will open the app in your browser automatically!',
        code: 'cd frontend\nnpm run dev',
      },
      {
        icon: '🎉',
        heading: 'Try the app!',
        body: 'Open your browser and go to http://localhost:5173 — You should see the login page! Try registering a new account and writing your first note. Congratulations — you just built a real web app! 🥳',
        code: '👉 Open: http://localhost:5173',
      },
    ],
  },
  {
    id: 'howworks',
    emoji: '🔄',
    title: 'How Does It All Work Together?',
    color: '#fce7f3',
    steps: [
      {
        icon: '1️⃣',
        heading: 'You open the app in your browser',
        body: 'Your browser loads the React frontend — the Login page appears. React is running inside your browser.',
      },
      {
        icon: '2️⃣',
        heading: 'You type your email and password and click Sign In',
        body: 'React sends your email and password to the backend (Node.js + Express) using Axios. It is like sending a letter to the kitchen.',
      },
      {
        icon: '3️⃣',
        heading: 'The backend checks your password',
        body: 'Express receives the request. It looks up your email in MongoDB. It checks if your password matches the scrambled (hashed) version saved there.',
      },
      {
        icon: '4️⃣',
        heading: 'The backend sends back a Token',
        body: 'If the password is correct, the backend creates a special code called a JWT Token. Think of it as a VIP wristband at a party. The frontend saves it in localStorage.',
      },
      {
        icon: '5️⃣',
        heading: 'You see your notes!',
        body: 'The frontend uses the token like a wristband to ask "show me my notes". The backend checks the token, finds your notes in MongoDB, and sends them back. React shows them on your screen!',
      },
    ],
  },
];

/* ── Collapsible Section Component ── */
const Section = ({ section }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.section} style={{ '--section-color': section.color }}>
      <button className={styles.sectionHeader} onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className={styles.sectionEmoji}>{section.emoji}</span>
        <span className={styles.sectionTitle}>{section.title}</span>
        <span className={styles.chevron}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={styles.sectionBody}>
          {section.steps.map((step, i) => (
            <div key={i} className={styles.stepCard}>
              <div className={styles.stepTop}>
                <span className={styles.stepIcon}>{step.icon}</span>
                <div className={styles.stepRight}>
                  <div className={styles.stepHeadRow}>
                    <h3 className={styles.stepHeading}>{step.heading}</h3>
                    {step.tag && (
                      <span className={styles.tag} style={{ background: step.tagColor }}>
                        {step.tag}
                      </span>
                    )}
                  </div>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </div>
              {step.code && <CodeBlock code={step.code} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Tutorial Page ── */
const TutorialPage = () => (
  <div className={styles.page}>

    {/* Hero */}
    <header className={styles.hero}>
      <div className={styles.heroLogo}>
        <span>📓</span>
        <span className={styles.heroLogoText}>MyNotes</span>
      </div>
      <h1 className={styles.heroTitle}>🛠️ How We Built This App</h1>
      <p className={styles.heroSub}>
        A simple guide for beginners — even school kids can follow along and build this! 🎒
      </p>
      <div className={styles.heroBadges}>
        {['React ⚛️', 'Node.js 🟩', 'MongoDB 🍃', 'Express 🚂', 'JWT 🔐', 'Axios 📡'].map(b => (
          <span key={b} className={styles.heroBadge}>{b}</span>
        ))}
      </div>
    </header>

    {/* Quick summary boxes */}
    <div className={styles.summaryRow}>
      <div className={styles.summaryBox} style={{ background: '#dbeafe' }}>
        <span className={styles.summaryIcon}>⏱️</span>
        <span className={styles.summaryLabel}>Time to build</span>
        <span className={styles.summaryValue}>2 – 4 hours</span>
      </div>
      <div className={styles.summaryBox} style={{ background: '#d1fae5' }}>
        <span className={styles.summaryIcon}>🎯</span>
        <span className={styles.summaryLabel}>Difficulty</span>
        <span className={styles.summaryValue}>Beginner</span>
      </div>
      <div className={styles.summaryBox} style={{ background: '#fde68a' }}>
        <span className={styles.summaryIcon}>💰</span>
        <span className={styles.summaryLabel}>Cost</span>
        <span className={styles.summaryValue}>100% Free</span>
      </div>
      <div className={styles.summaryBox} style={{ background: '#ede9fe' }}>
        <span className={styles.summaryIcon}>🖥️</span>
        <span className={styles.summaryLabel}>Works on</span>
        <span className={styles.summaryValue}>Windows / Mac</span>
      </div>
    </div>

    {/* Sections */}
    <main className={styles.main}>
      {sections.map(s => <Section key={s.id} section={s} />)}
    </main>

    {/* Footer */}
    <footer className={styles.footer}>
      <div className={styles.footerCard}>
        <span className={styles.footerEmoji}>🥳</span>
        <h2 className={styles.footerTitle}>You did it!</h2>
        <p className={styles.footerText}>
          You now know how a real web app is built from scratch.<br />
          Go ahead — start writing your notes!
        </p>
        <Link to="/login" className={styles.footerBtn}>🚀 Go to Sign In</Link>
      </div>
    </footer>
  </div>
);

export default TutorialPage;
