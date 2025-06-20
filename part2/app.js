const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware

app.use(express.json());
app.use(session({
  secret: 'a-very-secret-key',   // change to env var in production
  resave: false,                 // don’t save session if unmodified
  saveUninitialized: false,      // don’t create session until something stored
  cookie: {
    secure: false,              
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
