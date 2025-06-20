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
    console.log('Dogs query returned:', rows);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
