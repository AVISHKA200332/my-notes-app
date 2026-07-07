# My Notes App — MERN Stack

A full-stack Notes application with JWT authentication built on MongoDB, Express, React, and Node.js.

## Project Structure

```
my-notes-app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register / Login / Me
│   │   └── noteController.js  # CRUD for notes
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect middleware
│   ├── models/
│   │   ├── User.js            # Mongoose User schema
│   │   └── Note.js            # Mongoose Note schema
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth/*
│   │   └── noteRoutes.js      # /api/notes/*
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js   # Axios base config + JWT interceptor
    │   │   ├── authApi.js
    │   │   └── notesApi.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── DashboardPage.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env       # Fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                # Starts on http://localhost:5173
```

## Team Split Suggestion

| Member | Ownership |
|--------|-----------|
| Dev A  | Backend — `authController.js`, `User.js`, auth routes & middleware |
| Dev B  | Backend — `noteController.js`, `Note.js`, note routes |
| Dev C  | Frontend — pages, components, context, API layer |

## API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Private | Get current user |
| GET | `/api/notes` | Private | Get all user notes |
| POST | `/api/notes` | Private | Create a note |
| GET | `/api/notes/:id` | Private | Get single note |
| PUT | `/api/notes/:id` | Private | Update a note |
| DELETE | `/api/notes/:id` | Private | Delete a note |
