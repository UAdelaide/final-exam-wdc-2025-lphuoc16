var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
    const [row] = await db.query(`
      SELECT
        r.request_id,
        d.name AS dog_name,
        r.requested_time AS req_time,
        r.duration_minutes,
        r.location AS location,
        u.username AS owner_name
      FROM WalkRequests r
      JOIN Dogs d ON r.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE r.status = 'open'
    `);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router

module.exports = router;
