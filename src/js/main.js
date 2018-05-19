// style imports via parcel
import "../scss/main.scss"

import steem from 'steem'
import $ from 'jquery'
import showdown from 'showdown'
import moment from 'moment'
import purify from 'dompurify'

let allUsers = []
let allContent = []
let converter = new showdown.Converter({ tables: true })
let totalVestingShares, totalVestingFundSteem;
const FEEDNAME = 'steemversary'
const MAINCAT = 'test-123'

// PAGES
const INDEXPAGE = $('main').hasClass('index')
const PROFILEPAGE = $('main').hasClass('profile')


let workoutIcons = {
  run: '<svg class="workout__icon" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><style>.st0{fill:#010101}</style><path class="st0" d="M42.8 18.7c2.2 0 4.1-1.8 4.1-4.1s-1.8-4.1-4.1-4.1-4.1 1.8-4.1 4.1 1.8 4.1 4.1 4.1zM46.8 24h-6L39 19.7c-.1-.2-.2-.4-.3-.5l-.1-.2-4-4.8L31 10c-.4-.4-.9-.7-1.5-.7h-7.7c-1.1 0-2 .9-2 2s.9 2 2 2h6.8l2.2 2.6-8.5 8.1c-.2.1-.4.3-.6.5-1.3 1.3-1.2 3.4.1 4.7l6.6 6.3-8.6 2.1c-1.1.3-1.7 1.3-1.5 2.4.3 1.1 1.3 1.7 2.4 1.5l12.1-2.9c.2-.1.5-.2.7-.3.9-.6 1.1-1.8.5-2.7V35l-5-7.3 7.2-5 1.7 4c.3.7 1 1.2 1.8 1.2H47c1.1 0 2-.9 2-2-.2-1-1.1-1.9-2.2-1.9z"/><path class="st0" d="M20.2 30.7c-1-1-1.6-2.3-1.8-3.7l-13 11.3c-.9.7-1 2-.3 2.9.7.9 2.1 1.1 3 .4l13-10-.9-.9zM23 17.9c0 .7-.6 1.2-1.2 1.2H11.7c-.7 0-1.2-.6-1.2-1.2 0-.7.6-1.2 1.2-1.2h10.1c.6 0 1.2.5 1.2 1.2zM18.4 22.5c0 .7-.6 1.2-1.2 1.2H7.1c-.7 0-1.2-.6-1.2-1.2 0-.7.6-1.2 1.2-1.2h10.1c.6 0 1.2.6 1.2 1.2zM13.7 27.2c0 .7-.6 1.2-1.2 1.2H2.4c-.7 0-1.2-.6-1.2-1.2 0-.7.6-1.2 1.2-1.2h10.1c.7-.1 1.2.5 1.2 1.2z"/></svg>',
  cycle: '<svg class="workout__icon" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><style>.st0{fill:#010101}</style><path class="st0" d="M28.2 21.3l-.3-.1-10.6-5.3c.1-.1.1-.1.2-.1.1-.1 0 0 .2-.1 0 0 .1 0 0 0h.1l.1-.1c.3-.2.7-.3 1.1-.5.5-.1 1-.3 1.5-.4.5-.1 1.1-.2 1.6-.2 1.1-.1 2.1-.1 3.1 0 .5 0 .9.1 1.2.1.4 0 .7.1.9.1.6.1.9.1.9.1h1.2l1.3 7.1c.2.9.9 1.5 1.8 1.5h10.1c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H34L32.7 13c1.2.8 2.8 1 4.2.2 1.9-1.1 2.5-3.4 1.5-5.3C37.3 6 35 5.4 33.1 6.4c-.6.3-1.1.8-1.4 1.3C31 7 30.1 6.5 29 6.5c0 0-.3 0-1-.1-.4 0-.8 0-1.3-.1h-1.6c-1.2 0-2.5.1-4.1.3-.8.1-1.5.2-2.3.4-.8.2-1.6.4-2.5.8-.8.3-1.7.8-2.6 1.3l-.3.2-.2.1-.1.1-.1.1c-.1.1-.4.3-.6.5-.4.4-.7.7-1 1.1-.6.8-1.2 1.7-1.5 2.9-.2.6-.3 1.2-.3 1.9s.2 1.4.4 2c.5 1.3 1.3 2 2 2.5.6.5 1.2.7 1.6.9.3.1.6.2.8.3.1 0 .2.1.3.1l8 2.3-3.6 3.6c-.6-1-1.3-1.8-2.3-2.5-1.4-1-3.1-1.5-4.8-1.5-3.3 0-6.6 1.8-8.8 4.8-1.6 2.3-2.4 5-2.2 7.6.2 2.7 1.4 4.9 3.4 6.4 1.4 1 3.1 1.5 4.8 1.5 3.3 0 6.6-1.8 8.8-4.8 1.6-2.3 2.4-5 2.2-7.6v-.2l8.2-6.7c.2-.2.4-.4.6-.7.8-.9.3-2.2-.7-2.7zM16.9 38.5c-1.9 2.6-4.7 4.2-7.5 4.2-1.5 0-2.8-.4-3.9-1.2-1.6-1.2-2.6-3-2.8-5.2-.2-2.3.5-4.6 1.9-6.6 1.9-2.6 4.7-4.2 7.5-4.2 1.5 0 2.8.4 3.9 1.2.9.6 1.6 1.5 2 2.4l-2.4 2.5c-.5.6-.6 1.4-.1 2 .5.6 1.5.7 2.1.2l1.2-1c.1 2-.6 4-1.9 5.7zm-.4-23c-.1-.1-.2-.1-.2-.2 0 0 .1 0 .2.2z"/><path class="st0" d="M48.9 31.8c-.2-2.7-1.4-4.9-3.4-6.4-1.4-1-3.1-1.5-4.8-1.5-3.3 0-6.6 1.8-8.8 4.8-1.6 2.3-2.4 5-2.2 7.6.2 2.7 1.4 4.9 3.4 6.4 1.4 1 3.1 1.5 4.8 1.5 3.3 0 6.6-1.8 8.8-4.8 1.6-2.3 2.4-5 2.2-7.6zm-3.5 6.7c-1.9 2.6-4.7 4.2-7.5 4.2-1.5 0-2.8-.4-3.9-1.2-1.6-1.2-2.6-3-2.8-5.2-.2-2.3.5-4.6 1.9-6.6 1.9-2.6 4.7-4.2 7.5-4.2 1.5 0 2.8.4 3.9 1.2 1.6 1.2 2.6 3 2.8 5.2.2 2.3-.5 4.6-1.9 6.6z"/><path class="st0" d="M40.7 32c-.4-.3-.8-.4-1.2-.4-.8 0-1.6.4-2.1 1.1-.4.5-.6 1.2-.5 1.8.1.7.4 1.2.9 1.6.4.3.8.4 1.2.4.8 0 1.6-.4 2.1-1.1.4-.5.6-1.2.5-1.8-.1-.7-.4-1.2-.9-1.6zm-.9 2.5c-.3.4-.8.6-1.1.4-.2-.1-.2-.3-.2-.5s.1-.5.2-.7c.2-.3.5-.5.8-.5.1 0 .2 0 .3.1.2.1.2.3.2.5s0 .4-.2.7zM12.3 32c-.4-.3-.8-.4-1.2-.4-.8 0-1.6.4-2.1 1.1-.4.5-.6 1.2-.5 1.8.1.7.4 1.2.9 1.6.4.3.8.4 1.2.4.8 0 1.6-.4 2.1-1.1.4-.5.6-1.2.5-1.8-.1-.7-.4-1.2-.9-1.6zm-.9 2.5c-.3.4-.8.6-1.1.4-.3-.2-.3-.4-.3-.5 0-.2.1-.5.2-.7.2-.3.5-.5.8-.5.1 0 .2 0 .3.1.2.1.2.3.2.5.1.2 0 .4-.1.7z"/></svg>',
  swim: '<svg class="workout__icon" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><style>.st0{fill:#010101}</style><path class="st0" d="M44.7 25.4c-.7.4-1.1.7-2.1.7s-1.5-.3-2.1-.7c-.8-.5-1.9-1.2-3.8-1.2-1.2 0-2 .3-2.7.6l-7.2-1.3c1.6-.6 2.4-2.5 1.7-4.1-.6-1.6-2.4-2.4-4-1.8-.9.4-1.6 1.1-1.8 2l-1.9-3.1c-.1-.2-.2-.3-.4-.4l-5.7-4.3c-.3-.3-.8-.3-1.2-.2l-7.8 1.9c-.8.2-1.2 1-1.1 1.8.2.8 1 1.3 1.7 1.1l7.1-1.7 5 3.7.1.1-8 6.2c-.5.2-1 .5-1.4.8-.7.4-1.1.7-2.1.7s-1.5-.3-2.1-.7c-.8-.5-1.9-1.2-3.8-1.2v1.5c1.5 0 2.3.5 3 1 .7.5 1.5.9 2.9.9s2.2-.5 2.9-.9c.7-.5 1.5-1 3-1s2.3.5 3 1c.7.5 1.5.9 2.9.9s2.2-.5 2.9-.9c.7-.5 1.5-1 3-1s2.3.5 3 1c.7.5 1.5.9 2.9.9s2.2-.5 2.9-.9c.7-.5 1.5-1 3-1s2.3.5 3 1c.7.5 1.5.9 2.9.9 1.5 0 2.2-.5 2.9-.9.7-.5 1.5-1 3-1v-1.5c-1.7-.1-2.7.5-3.6 1.1zM42.6 31.6c-1 0-1.5-.3-2.1-.7-.8-.5-1.9-1.2-3.8-1.2s-3 .7-3.8 1.2c-.7.4-1.1.7-2.1.7s-1.5-.3-2.1-.7c-.8-.5-1.9-1.2-3.8-1.2s-3 .7-3.8 1.2c-.7.4-1.1.7-2.1.7s-1.5-.3-2.1-.7c-.8-.5-1.9-1.2-3.8-1.2s-3 .7-3.8 1.2c-.7.4-1.1.7-2.1.7s-1.5-.3-2.1-.7c-.8-.5-1.9-1.2-3.8-1.2v1.5c1.5 0 2.3.5 3 1 .6.4 1.3.8 2.7.8 1.4 0 2.2-.5 2.9-.9.7-.5 1.5-1 3-1s2.3.5 3 1c.7.5 1.5.9 2.9.9s2.2-.5 2.9-.9c.7-.5 1.5-1 3-1s2.3.5 3 1c.7.5 1.5.9 2.9.9s2.2-.5 2.9-.9c.7-.5 1.5-1 3-1s2.3.5 3 1c.7.5 1.5.9 2.9.9 1.5 0 2.2-.5 2.9-.9.7-.5 1.5-1 3-1v-1.5c-1.9 0-2.9.7-3.8 1.2-.5.5-.9.8-1.9.8zM42.6 37c-1 0-1.5-.3-2.1-.7-.8-.5-1.9-1.2-3.8-1.2s-3 .7-3.8 1.2c-.7.4-1.1.7-2.1.7s-1.5-.3-2.1-.7c-.8-.5-1.9-1.2-3.8-1.2s-2.9.7-3.8 1.2c-.7.4-1.1.7-2.1.7s-1.5-.3-2.1-.7c-.8-.5-1.9-1.2-3.8-1.2s-2.9.7-3.8 1.2c-.8.4-1.2.7-2.3.7-1 0-1.5-.3-2.1-.7-.8-.5-1.9-1.2-3.8-1.2v1.5c1.5 0 2.3.5 3 1 .8.4 1.5.9 2.9.9s2.2-.5 2.9-.9c.7-.5 1.5-1 3-1s2.3.5 3 1c.7.5 1.5.9 2.9.9s2.2-.5 2.9-.9c.7-.5 1.5-1 3-1s2.3.5 3 1c.7.5 1.5.9 2.9.9s2.2-.5 2.9-.9c.7-.5 1.5-1 3-1s2.3.5 3 1c.7.5 1.5.9 2.9.9 1.5 0 2.2-.5 2.9-.9.7-.5 1.5-1 3-1v-1.5c-1.9 0-2.9.7-3.8 1.2-.5.4-.9.7-1.9.7z"/></svg>',
  workout: '<svg class="workout__icon" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><style>.st0{fill:#010101}</style><path class="st0" d="M18.3 7c-1 0-1.9.8-1.9 1.9s.8 1.9 1.9 1.9 1.9-.8 1.9-1.9S19.4 7 18.3 7zm0 2.4c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5c.1.2-.2.5-.5.5z"/><path class="st0" d="M34.8 15.6c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5c-2 0-3.8 1.4-4.3 3.3L23.8 9v-.2c0-3-2.5-5.5-5.5-5.5s-5.5 2.5-5.5 5.5 2.5 5.5 5.5 5.5h.2l3.4 7.3c.1.2.2.4.4.5l.1.8-.9 9.1-2.2 7.1-7.1 4.2c-.6.4-.9 1.2-.6 1.8.3.7 1.2 1.1 1.9.7l8.3-3.7c.4-.2.7-.5.8-.8l.1-.2 2.7-6 5.4 1.9-2.6 6.4c-.3.7 0 1.5.6 1.8.7.4 1.6.1 2-.6l4.4-7.9s0-.1.1-.1c.4-.9 0-2.1-.9-2.5l-.2-.1-6.5-3 1.8-7.5.1-.3v-.7c.1 0 .3-.1.4-.1 1.6-.7 2.3-2.5 1.6-4.1-.1-.3-.3-.6-.5-.8l1-2.9c.6.6 1.6 1 2.7 1zm0-7.6c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1c-.9 0-1.8-.4-2.4-1.1l.6-1.6 1.7.2.2-1.3-3-.4c.4-1.2 1.5-2 2.9-2zm-20.6.8c0-2.3 1.9-4.1 4.1-4.1s4.1 1.9 4.1 4.1-1.8 4.2-4.1 4.2-4.1-1.9-4.1-4.2zm7.3 4.5c1-.7 1.8-1.7 2.1-3l6.2.8-1.8 5.3c-.2 0-.4.1-.6.2-1.2.5-1.9 1.7-1.9 2.9l-1.1-.1-2.9-6.1z"/></svg>'
}
/**
 * gets totalVestingShares and totalVestingFundSteem from STEEM API to use later
 */
steem.api.getDynamicGlobalProperties((err, result) => {
  totalVestingShares = result.total_vesting_shares;
  totalVestingFundSteem = result.total_vesting_fund_steem;
})

// Alias for getting the latest posts from a specific user defaulting to 14 Posts
function getBlog(username){
  return steem.api.getDiscussionsByBlogAsync({tag: username, limit: 14})
}

function getPostAndComments(url) {
  return new Promise(function(resolve, reject) {
    steem.api.getState(url, (err, result) => {
      let users = result.accounts;
      let resultsArray = [];
      for ( let post in result.content ){
        resultsArray.push({
          id: result.content[post].id,
          title: result.content[post].root_title,
          author: result.content[post].author,
          body: result.content[post].body,
          json: result.content[post].json_metadata,
          permlink: result.content[post].permlink,
          depth: result.content[post].depth,
          root_comment: result.content[post].root_comment,
          parent_permlink: result.content[post].parent_permlink,
          created: result.content[post].created,
          votes: result.content[post].net_votes,
          voters: result.content[post].active_votes.map(vote => vote.voter),
          value: Math.round( parseFloat(result.content[post].pending_payout_value.substring(0,5)) * 100) / 100
        })
      }
      resultsArray = resultsArray.sort((a,b) => b.id - a.id );
      resolve(resultsArray)
    })
  })
}

function getAccountInfo(username) {
    return new Promise((resolve, reject) => {
      steem.api.getAccounts([username], (err, result) => {
        let user = result[0]
        let jsonData;

        try {jsonData = JSON.parse(user.json_metadata).profile} catch(err) { console.log(err)}
        console.log(jsonData)
        // steem power calc
        let vestingShares = user.vesting_shares;
        let delegatedVestingShares = user.delegated_vesting_shares;
        let receivedVestingShares = user.received_vesting_shares;
        let steemPower = steem.formatter.vestToSteem(vestingShares, totalVestingShares, totalVestingFundSteem);
        let delegatedSteemPower = steem.formatter.vestToSteem((receivedVestingShares.split(' ')[0])+' VESTS', totalVestingShares, totalVestingFundSteem);
        let outgoingSteemPower = steem.formatter.vestToSteem((receivedVestingShares.split(' ')[0]-delegatedVestingShares.split(' ')[0])+' VESTS', totalVestingShares, totalVestingFundSteem) - delegatedSteemPower;

        // vote power calc
        let lastVoteTime = (new Date - new Date(user.last_vote_time + "Z")) / 1000;
        let votePower = user.voting_power += (10000 * lastVoteTime / 432000);
        votePower = Math.min(votePower / 100, 100).toFixed(2);

        let data = {
          name: user.name,
          image: jsonData.profile_image ? 'https://steemitimages.com/512x512/' + jsonData.profile_image : '',
          cover: jsonData.cover_image,
          rep: steem.formatter.reputation(user.reputation),
          effectiveSp: parseInt(steemPower  + delegatedSteemPower - -outgoingSteemPower),
          sp: parseInt(steemPower).toLocaleString(),
          delegatedSpIn: parseInt(delegatedSteemPower).toLocaleString(),
          delegatedSpOut: parseInt(-outgoingSteemPower).toLocaleString(),
          vp: votePower,
          steem: user.balance.substring(0, user.balance.length - 5),
          sbd: user.sbd_balance.substring(0, user.sbd_balance.length - 3),
          numOfPosts: user.post_count,
          followerCount: '',
          followingCount: '',
          usdValue: '',
          createdDate: new Date (user.created)
        }
        steem.api.getFollowCount(user.name, function(err, result){
          data.followerCount = result.follower_count
          data.followingCount = result.following_count
          resolve(data)
        })
        data.usdValue = steem.formatter.estimateAccountValue(user)
      })
    });
}

//
// @data - Array - list of posts from STEEM API
function processPosts(data, username){
  let posts = data.filter(post => post.category === MAINCAT)
  if(username){
    console.log(username)
    posts.forEach((post, i) => getPostAndComments(post.url).then(data => processWorkoutsByUsername(data, username)))
  } else {
    posts.forEach((post, i) => getPostAndComments(post.url).then(data => processWorkouts(data)))
  }
}

function processWorkouts(workouts) {
    let $wrk = $('.workouts')
    workouts.pop() // Remove the top level post (Posted by moveclub account)
    workouts.reverse()
    workouts.forEach( workout => $wrk.prepend(createWorkoutTemplate(workout)))
    $wrk.prepend(`<div class="workout--date-divider"><p class="workout__date">${moment(workouts[0].created).fromNow()}</p></div>`)
}

function processWorkoutsByUsername(workouts, username ){
  let $wrk = $('.workouts')
  workouts = workouts.filter(w => w.author === username)
  if (workouts.length > 0) $('.workouts').append(`<div class="workout--date-divider"><p class="workout__date">${workouts[0].created}</p></div>`)
  if (workouts.length === 0) $('.workouts').append('<h5 class="profile__subheading">No Activity To Display...</h5>')
  workouts.forEach( workout => $wrk.append(createWorkoutTemplate(workout)))
}

function createWorkoutTemplate(workout){
  let data = JSON.parse(workout.json)
  Object.keys(data).forEach(key => data[key] = purify.sanitize(data[key]))
  let user = $('main').data('user')
  let voted = false
  if (user) voted = workout.voters.indexOf(user.name) > -1 ? true : false

  return `
  <div class="workout"
    data-postid="${workout.id}"
    data-athlete="${workout.author}"
    data-permlink="${workout.permlink}"
    data-votes="${workout.votes}"
  >
    ${workoutIcons[data.workoutType]}
    <p class="workout__details"><a href="/@${workout.author}">@${workout.author}</a> &middot; completed a ${data.workoutType} &middot; ${data.distance}${data.distanceUnit}</p>
    <div class="workout__hearts vote workout__hearts--voted-${voted}">&hearts; ${workout.votes}</div>
  </div>
  `
}

function displayProfilePage(){
  let username = $('.profile').data('username')
  getAccountInfo(username).then(data => {
    data.cover = data.cover || 'http://placehold.it/1200x300?text=-'
    let template =
    `<div class="profile__header">
      <img class="profile__avatar" src="${data.image}" width="100px">
      <h3 class="profile__heading">@${data.name}</h2>
      <h5 class="profile__subheading">Followers: ${data.followerCount}</h5>
      <h5 class="profile__subheading">Following: ${data.followingCount}</h5>
      </div>
    `
    $('.profile__info').prepend(template)
    getBlog(FEEDNAME).then(data => processPosts(data, username))
  })
}


// Fire page specific actions
if (INDEXPAGE) getBlog(FEEDNAME).then(data => processPosts(data))
if (PROFILEPAGE) displayProfilePage()

// UI Actions

$('main').on('click', '.vote',(e) => {
  let $voteButton = $(e.currentTarget)
  let workout = $(e.currentTarget).parent().data()
  $voteButton.html('<img class="loading-spinner" src="/img/spinner.gif">')

  e.preventDefault()
  $.post({
    url: '/post/vote',
    dataType: 'json',
    data:  {
      postId: workout.postid,
      author: workout.athlete,
      permlink: workout.permlink,
      weight: parseInt($('.vote-weight__value').data('weight')) * 100
    }
  }, (response) => {
    if (response.error) {
      $(`<span>${response.error.error_description}</span>`).insertAfter($voteButton)
    } else {
      $voteButton.addClass('workout__hearts--voted-true')
      $voteButton.html(`&hearts; ${parseInt(workout.votes) + 1}`)
    }
  })
})

$('main').on('click', '.overlay__submit', (e) => {
  let $comment = $(e.currentTarget)

  $.post({
        url: `/post/comment`,
        dataType: 'json',
        data: {
          parentAuthor: $comment.data('parent'),
          message: $('.comment-message').val(),
          parentTitle: $comment.data('parent-title'),
          workoutType: $('.input__workoutType').data('workout'),
          distance: $('.input__distance').val(),
          distanceUnit: $('.input__distanceUnit').val(),
          workoutDuration: $('.input__workoutDuration').val()
        }
      }, (response) => {
          console.log(response)
          if (response.error) {
            $(`<span>${response.error.error_description}</span>`).insertAfter($comment)
          } else {
            $('.overlay').hide()
            // $(`<p>${response.msg}</p>`).insertAfter($comment)
          }
      })
})

$('.overlay__activity').on('click', (e) => {
  $('.overlay__activity').removeClass('overlay__activity--active')
  $(e.currentTarget).addClass('overlay__activity--active')
  let workout = $(e.currentTarget).data('workout')
  $('.input__workoutType').data('workout', workout)
})

$('.overlay__bg').on('click', (e) => {
  $('.overlay, .overlay__bg').fadeOut(300, () => $('.overlay, .overlay__bg').hide())
})

$('.overlay').hide()

$('.cta').on('click', (e) => {
  $('.overlay__bg').show(200)
  $('.overlay').show(100,() => {
    $('.overlay').addClass('overlay--active')
  })
})


$('.vote-weight').on('click', (e) => {
  $('.vote__slider').show()
})

$('.slider__close').on('click', (e) => {
  $('.vote__slider').hide()
})


$('nav').on('input', '.slider__input', (e) => {
  let weight = $('.slider__input').val()
  $('.vote-weight__value').text(weight + '%')
  $('.vote-weight__value').data('vote-weight', weight)
})
