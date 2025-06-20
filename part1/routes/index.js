var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/dogs', async (req, res) => {
  const [rows] = await db.query(`
    SELECT
      d.name AS dog_name,
      d.size AS dog_size,
      u.username AS owner_name
    FROM
      
  `)
});
module.exports = router;
