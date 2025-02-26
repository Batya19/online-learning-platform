const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('your-database-file.db');
const authRoutes = require('./routes/auth')(db);
const userRoutes = require('./routes/users')(db);
const courseRoutes = require('./routes/courses')(db);
const lessonRoutes = require('./routes/lessons')(db);

const app = express();

// Middleware
app.use(bodyParser.json());

// Initialize database schema
db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student'
    )
  `);

  db.run(`
    CREATE TABLE courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      teacherId INTEGER NOT NULL,
      FOREIGN KEY (teacherId) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      courseId INTEGER NOT NULL,
      FOREIGN KEY (courseId) REFERENCES courses(id)
    )
  `);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses/:courseId/lessons', lessonRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});