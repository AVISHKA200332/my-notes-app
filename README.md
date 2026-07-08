# My Notes App — Auth Only (MERN)

JWT-based Register & Login using MongoDB, Express, React (Vite), Node.js.

## Project Structure

```
my-notes-app/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   └── authController.js      # register / login / getMe
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect middleware
│   │   ├── rateLimiter.js         # Brute-force protection
│   │   └── validateRequest.js     # Required-field validator
│   ├── models/
│   │   └── User.js                # Mongoose User schema
│   ├── routes/
│   │   └── authRoutes.js          # /api/auth/*
│   ├── utils/
│   │   ├── AppError.js            # Custom error class
│   │   └── generateToken.js       # JWT signing helper
│   ├── .env                       # Real secrets (git-ignored)
│   ├── .env.example
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js   # Axios + JWT interceptor
    │   │   └── authApi.js         # register / login / getMe calls
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── Auth.module.css    # Shared styles for both pages
    │   ├── App.jsx                # Routes: /login, /register
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev        # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login, receive JWT |
| GET | `/api/auth/me` | Private (Bearer) | Get current user |
| GET | `/api/health` | Public | Server health check |
