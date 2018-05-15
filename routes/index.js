let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>  {
  res.render('index', { title: 'SteemConnect Boilerplate' });
});

/* GET a users profile page. */
router.get('/@:username', (req, res, next) => {
      let username = req.params.username
      res.render('profile', {
        username: username
      });
});

module.exports = router;
