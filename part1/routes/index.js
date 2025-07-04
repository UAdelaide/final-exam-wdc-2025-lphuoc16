var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// part 1
router.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        d.name AS dog_name,
        d.size AS dog_size,
        u.username AS owner_name
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        wr.request_id,
        d.name AS dog_name,
        wr.requested_time AS req_time,
        wr.duration_minutes,
        wr.location AS location,
        u.username AS owner_name
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        u.username AS walker_username,
        COUNT(r.rating_id) AS total_ratings,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(DISTINCT CASE WHEN wr.status = 'completed' THEN wr.request_id END) AS completed_tasks
      FROM Users u
      LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id AND wa.status = 'accepted'
      LEFT JOIN WalkRequests wr ON wa.request_id = wr.request_id
      LEFT JOIN WalkRatings r ON r.request_id = wr.request_id AND r.walker_id = u.user_id
      WHERE u.role = 'walker'
      GROUP BY u.user_id, u.username
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error in /api/walkers/summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
