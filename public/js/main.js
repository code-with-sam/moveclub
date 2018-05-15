let allUsers = []
let allContent = []
let converter = new showdown.Converter({ tables: true })
let totalVestingShares, totalVestingFundSteem;
const FEEDNAME = 'steemversary'
const MAINCAT = 'test-123'
let workoutIcons = {
  run: '<svg class="workout__icon" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><style>.st0{fill:#010101}</style><path class="st0" d="M42.8 18.7c2.2 0 4.1-1.8 4.1-4.1s-1.8-4.1-4.1-4.1-4.1 1.8-4.1 4.1 1.8 4.1 4.1 4.1zM46.8 24h-6L39 19.7c-.1-.2-.2-.4-.3-.5l-.1-.2-4-4.8L31 10c-.4-.4-.9-.7-1.5-.7h-7.7c-1.1 0-2 .9-2 2s.9 2 2 2h6.8l2.2 2.6-8.5 8.1c-.2.1-.4.3-.6.5-1.3 1.3-1.2 3.4.1 4.7l6.6 6.3-8.6 2.1c-1.1.3-1.7 1.3-1.5 2.4.3 1.1 1.3 1.7 2.4 1.5l12.1-2.9c.2-.1.5-.2.7-.3.9-.6 1.1-1.8.5-2.7V35l-5-7.3 7.2-5 1.7 4c.3.7 1 1.2 1.8 1.2H47c1.1 0 2-.9 2-2-.2-1-1.1-1.9-2.2-1.9z"/><path class="st0" d="M20.2 30.7c-1-1-1.6-2.3-1.8-3.7l-13 11.3c-.9.7-1 2-.3 2.9.7.9 2.1 1.1 3 .4l13-10-.9-.9zM23 17.9c0 .7-.6 1.2-1.2 1.2H11.7c-.7 0-1.2-.6-1.2-1.2 0-.7.6-1.2 1.2-1.2h10.1c.6 0 1.2.5 1.2 1.2zM18.4 22.5c0 .7-.6 1.2-1.2 1.2H7.1c-.7 0-1.2-.6-1.2-1.2 0-.7.6-1.2 1.2-1.2h10.1c.6 0 1.2.6 1.2 1.2zM13.7 27.2c0 .7-.6 1.2-1.2 1.2H2.4c-.7 0-1.2-.6-1.2-1.2 0-.7.6-1.2 1.2-1.2h10.1c.7-.1 1.2.5 1.2 1.2z"/></svg>'
}
/**
 * gets totalVestingShares and totalVestingFundSteem from STEEM API to use later
 */
steem.api.getDynamicGlobalProperties((err, result) => {
  totalVestingShares = result.total_vesting_shares;
  totalVestingFundSteem = result.total_vesting_fund_steem;
})


function getaccounts(usernames){
  steem.api.getAccounts(usernames, (err, result) => {
    allUsers = allUsers.concat(result)
  })
}

function getBlog(username){
  return steem.api.getDiscussionsByBlogAsync({tag: username, limit: 14})
}

function getPostAndComments(url) {
  return new Promise(function(resolve, reject) {
    steem.api.getState(url, (err, result) => {
      let users = result.accounts;
      let resultsArray = [];
      for ( post in result.content ){
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
    let userInfo;

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


function processPosts(data){
  let posts = data.filter(post => post.category === MAINCAT)
  posts.forEach((post, i) => {
    getPostAndComments(post.url)
      .then(data => processWorkouts(data))
  })
}

function processWorkouts(workouts) {
    $('.workouts').append(`<div class="workout--date-divider"><p class="workout__date">${workouts[0].created}</p></div>`)
    workouts.pop() // remove the top level post
    workouts.forEach((workout) => {
      $('.workouts').append(createWorkoutTemplate(workout))
    })
}

function createWorkoutTemplate(workout){
  let data = JSON.parse(workout.json)
  return `
  <div class="workout">
    ${workoutIcons[data.workoutType]}
    <p class="workout__details">${workout.author} &middot; completed a ${data.workoutType} &middot; ${data.distance}${data.distanceUnit}</p>
    <div class="workout__hearts">&hearts; ${workout.votes}</div>
  </div>
  `
}



if ($('main').hasClass('index')) {
  getBlog(FEEDNAME).then(data => processPosts(data))
}

if ($('main').hasClass('profile') ) {
  let username = $('.profile').data('username')
  getAccountInfo(username).then(data => {
    data.cover = data.cover || 'http://placehold.it/1200x300?text=-'
    let template =
    `<header class="profile__header" style="background-image: url(${data.cover})">
      <h2>${data.name} [${data.rep}]</h2>
      <img src="${data.image}" width="100px">
      <h5>Followers: ${data.followerCount} - Following: ${data.followingCount}</h5>
      </header>
    `
    $('main').prepend(template)
  })
  let query = { tag: username, limit: 10 }
  getBlog(query, true)
}

// UI Actions

$('main').on('click', '.vote',(e) => {
  let $voteButton = $(e.currentTarget)
  e.preventDefault()
  $.post({
    url: '/post/vote',
    dataType: 'json',
    data:  $(e.currentTarget).parent().serialize()
  }, (response) => {
    if (response.error) {
      $(`<span>${response.error.error_description}</span>`).insertAfter($voteButton)
    } else {
      $('<span>Voted!</span>').insertAfter($voteButton)
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
          workoutType: 'run',
          distance: '3.2',
          distanceUnit: 'km',
          workoutDuration: '29'
        }
      }, (response) => {
          console.log(response)
          if (response.error) {
            $(`<span>${response.error.error_description}</span>`).insertAfter($comment)
          } else {
            $(`<p>${response.msg}</p>`).insertAfter($comment)
          }
      })
})



$('.overlay').hide()

$('.cta').on('click', (e) => {
  $('.overlay__bg').show(200)
  $('.overlay').show(100,() => {
    $('.overlay').addClass('overlay--active')
  })
})
