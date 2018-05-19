let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>  {
  res.render('index', { title: 'Move Club - Get Rewarded for using your body' });
});

router.get('/about', (req, res, next) =>  {
  res.render('about', { title: 'Move Club | About' });
});

router.get('/attributions', (req, res, next) =>  {
  res.render('attributions', { title: 'Move Club | Attributions' });
});

/* GET a users profile page. */
router.get('/@:username', (req, res, next) => {
      let username = req.params.username
      res.render('profile', {
        username: username
      });
});

module.exports = router;
