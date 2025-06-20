const mysql = require('mysql2/promise');

const db = mysql.createPool({
    // host: 'localhost',
    socketPath: '/var/run/mysqld/mysqld.sock',
    user: 'root',
    password: 'root',
    database: 'DogWalkService'
});

(async () => {
  try {
    // Insert data if table is empty
    await db.execute(`
        INSERT IGNORE INTO Users (username, email, password_hash, role)
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
        ((SELECT user_id FROM Users WHERE username='peterowner'),'Peter','large'),
        ((SELECT user_id FROM Users WHERE username='alice123'),'Daisy','medium'),
        ((SELECT user_id FROM Users WHERE username='peterowner'),'Phuoc','small')
    `);
    await db.execute(`
        INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
        VALUES
        ((SELECT dog_id FROM Dogs WHERE name='Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name='Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
        ((SELECT dog_id FROM Dogs WHERE name='Peter'), '2025-06-11 10:00:00', 20, 'Central Park', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name='Daisy'), '2025-06-11 11:00:00', 60, 'Northside Trail', 'completed'),
        ((SELECT dog_id FROM Dogs WHERE name='Phuoc'), '2025-06-12 08:30:00', 15, 'Lakeside Loop', 'cancelled')
    `);
    await db.execute(`
        INSERT IGNORE INTO WalkApplications (request_id, walker_id, applied_at, status)
        VALUES
        ((SELECT request_id FROM WalkRequests WHERE dog_id=(SELECT dog_id FROM Dogs WHERE name='Max')),(SELECT user_id FROM Users WHERE username='alice123'),'2025-06-01 12:00:00','accepted'),
        ((SELECT request_id FROM WalkRequests WHERE dog_id=(SELECT dog_id FROM Dogs WHERE name='Bella')),(SELECT user_id FROM Users WHERE username='carol123'),'2025-06-02 14:00:00','accepted')
    `);
    await pool.execute(`
    INSERT IGNORE INTO WalkRatings (request_id, walker_id, rating, comments, rated_at)
    VALUES
      ((SELECT request_id FROM WalkRequests WHERE dog_id=(SELECT dog_id FROM Dogs WHERE name='Daisy')),(SELECT user_id FROM Users WHERE username='bobwalker'),5,'Great walk!','2025-06-12 09:00:00'),
      ((SELECT request_id FROM WalkRequests WHERE dog_id=(SELECT dog_id FROM Dogs WHERE name='Daisy')),(SELECT user_id FROM Users WHERE username='bobwalker'),4,'On time','2025-06-12 09:05:00')
  `);

  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

module.exports = db;
