let express = require('express');
let util = require('../modules/util');
let steem = require('../modules/steemconnect')
let router = express.Router();
const PARENT = 'move-club.data'
const PERMLINK = 'move-club-data-testing-beta' // post permlink
const POST_TITLE = 'move-club'
// POST could update everyday?
//  - this then creates the daily group of workouts
//  - can be a default post about joining Move Club
//  - different each day of the week or list featured users/achivemnts/awards?

/* POST a vote broadcast to STEEM network. */
router.post('/vote', util.isAuthenticatedJSON, (req, res) => {
    steem.setAccessToken(req.session.access_token);
    let postId = req.body.postId
    let voter = req.session.steemconnect.name
    let author = req.body.author
    let permlink = req.body.permlink
    let weight = parseInt(req.body.weight)

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
    steem.setAccessToken(req.session.access_token);
    let author = req.session.steemconnect.name
    let permlink = 'move-club-' + util.urlString()
    let title = POST_TITLE
    let body = `${POST_TITLE} - @${author} - ${req.body.workoutType} - ${req.body.distance}${req.body.distanceUnit} - ${req.body.workoutDuration}mins`
    let parentAuthor = PARENT
    let parentPermlink = PERMLINK
    let s = req.body.workoutDurationSeconds !== '' ? req.body.workoutDurationSeconds  : 0
    let m = req.body.workoutDurationMinutes !== '' ? req.body.workoutDurationMinutes  : 0
    let h = req.body.workoutDurationHours !== '' ? req.body.workoutDurationHours  : 0
    let workoutDurationInSeconds = parseInt(s) + (parseInt(m) * 60) + (parseInt(h) * 60 * 60 )
    let customJson = {
      app: 'move.app/v0.1.0',
      workoutType: req.body.workoutType,
      distance: req.body.distance,
      distanceUnit: req.body.distanceUnit,
      workoutDurationInSeconds: workoutDurationInSeconds
    }

    steem.comment(parentAuthor, parentPermlink, author, permlink, title, body, customJson, (err, steemResponse) => {
      if (err) {
        res.json({ error: err.error_description })
      } else {
        res.json({
          msg: 'Posted To Steem Network',
          permlink: permlink,
          data: steemResponse
        })
      }
    });
});

module.exports = router;
