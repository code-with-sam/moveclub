let express = require('express');
let util = require('../modules/util');
let steem = require('../modules/steemconnect')
let router = express.Router();



/* GET a create post page. */
// router.get('/', util.isAuthenticated, (req, res, next) => {
//     res.render('post', {
//       name: req.session.steemconnect.name
//     });
// });

/* POST a create post broadcast to STEEM network. */
// router.post('/create-post', util.isAuthenticated, (req, res) => {
//     let author = req.session.steemconnect.name
//     let permlink = util.urlString()
//     var tags = req.body.tags.split(',').map(item => item.trim());
//     let primaryTag = tags[0] || 'photography'
//     let otherTags = tags.slice(1)
//     let title = req.body.title
//     let body = req.body.post
//     let customData = {
//       tags: otherTags,
//       app: 'boilerplate.app/v0.3.0'
//     }
//     steem.comment('', primaryTag, author, permlink, title, body, customData, (err, steemResponse) => {
//         if (err) {
//           res.render('post', {
//             name: req.session.steemconnect.name,
//             msg: 'Error - ${err}'
//           })
//         } else {
//           res.render('post', {
//             name: req.session.steemconnect.name,
//             msg: 'Posted To Steem Network'
//           })
//         }
//     });
// });

/* POST a vote broadcast to STEEM network. */
router.post('/vote', util.isAuthenticatedJSON, (req, res) => {
    let postId = req.body.postId
    let voter = req.session.steemconnect.name
    let author = req.body.author
    let permlink = req.body.permlink
    let weight = req.body.weight

    steem.vote(voter, author, permlink, weight, (err, steemResponse) => {
      if (err) {
          res.json({ error: err.error_description })
      } else {
          res.json({ id: postId })
      }
    });
})

/* POST a comment broadcast to STEEM network. */
router.post('/comment',  util.isAuthenticatedJSON, (req, res) => {
    const PARENT = 'steemversary'
    const PERMLINK = 'test-content' // post permlink
    let author = req.session.steemconnect.name
    let permlink = 'move-club-' + util.urlString()
    let title = 'Move Club Workout'
    let body = `Move Club Workout - @${author} - ${req.body.workoutType} - ${req.body.distance}${req.body.distanceUnit} - ${req.body.workoutDuration}mins`
    let parentAuthor = PARENT
    let parentPermlink = PERMLINK
    let customJson = {
      workoutType: req.body.workoutType,
      distance: req.body.distance,
      distanceUnit: req.body.distanceUnit,
      workoutDuration: req.body.workoutDuration
    }

    steem.comment(parentAuthor, parentPermlink, author, permlink, title, body, customJson, (err, steemResponse) => {
      if (err) {
        res.json({ error: err.error_description })
      } else {
        res.json({
          msg: 'Posted To Steem Network',
          res: steemResponse
        })
      }
    });
});

module.exports = router;
