require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");

const app = express();

// Connect Database
connectDB();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://my-notes-app-lyart-eta.vercel.app",
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

// Development Token Route
app.post("/api/dev/token", async (req, res) => {
  try {
    let user = await User.findOne({
      email: "testuser@example.com",
    });

    if (!user) {
      user = await User.create({
        name: "Test User",
        username: "testuser",
        email: "testuser@example.com",
        password: "not-hashed-this-is-just-for-testing",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Could not generate dev token",
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong.",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});