var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root' // Set your MySQL root password
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS dogwalks');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dogwalks.sql'
    });

    // Insert data if table is empty
    await db.execute(`
        INSERT INTO Users (username, email, password_hash, role)
        VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bobwalker@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('peterowner', 'peter@example.com', 'hashed100', 'owner'),
        ('phuocwalker', 'phuoc@example.com', 'hashed200', 'walker')
    `);
    await db.execute(`
        INSERT IGNORE INTO Dogs (owner_id, name, size)
        VALUES
        ((SELECT user_id FROM Users WHERE username='alice123'),'Max','medium'),
        ((SELECT user_id FROM Users WHERE username='carol123'),'Bella','small'),
        ((SELECT user_id FROM Users WHERE username='peterowner'),'peter','large'),
        ((SELECT user_id FROM Users WHERE username='alice123'),'Daisy','medium'),
        ((SELECT user_id FROM Users WHERE username='peterowner'),'Phuoc','small')
    `);
    await db.execute(`
    INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
    VALUES
      ((SELECT dog_id FROM Dogs WHERE name='Max'),   '2025-06-10 08:00:00', 30, 'Parklands',      'open'),
      ((SELECT dog_id FROM Dogs WHERE name='Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave',  'accepted'),
      ((SELECT dog_id FROM Dogs WHERE name='Charlie'),'2025-06-11 10:00:00', 20, 'Central Park',   'open'),
      ((SELECT dog_id FROM Dogs WHERE name='Daisy'), '2025-06-11 11:00:00', 60, 'Northside Trail','completed'),
      ((SELECT dog_id FROM Dogs WHERE name='Buddy'), '2025-06-12 08:30:00', 15, 'Lakeside Loop',  'cancelled')
  `);

  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

module.exports = app;
