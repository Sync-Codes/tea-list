/*global io, getCookie, showdown*/
let socket = io();

// Configure ID
let ID = window.location.search;
if (!ID) location.replace('https://tea-list.glitch.me/');
else ID = ID.slice(1);

let bearer = getCookie("bearer");
if (bearer) {
  socket.emit('fetchInfo', bearer);
  socket.on('fetchInfoCallback', function(data) {
    if (!data) return $('#loginButton').html('<a href="https://tea-list.glitch.me/login"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>');
    $('.username').text(data.username);
    $('#discordUsernameDrop').removeAttr('style');
  })
} else {
  $('#submitButton').text('Login to vote')
  document.cookie = `redirect=${document.documentURI}`;
  $('#loginButton').html('<a href="https://tea-list.glitch.me/login"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>')
}

socket.emit('fetchBotInfo', {
  id: ID,
  bearer: getCookie('bearer')
});
socket.on('fetchBotInfoCallback', function(data) {
  if (data === 'INVALID BOT') return location.replace('https://tea-list.glitch.me/');
  if (data.acc && data.owners && data.owners.includes(data.acc.id)) $('#ownerStatus').attr("class", "alert text-center alert-dismissible fade show").addClass(`alert-dark`).html(`You are the owner of this bot<br><b>Status: ${data.status}</b><button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>`);
  if (typeof data.bot === 'string') return $('#ownerStatus').attr("class", "alert text-center").addClass(`alert-dark`).html(`<b>We were unable to find a bot with this ID, sorry!</b>`);

  document.title = `Upvote ${data.bot.cached.username}`;

  $('#icon').attr('src', `https://cdn.discordapp.com/avatars/${data.bot.cached.id}/${data.bot.cached.avatar}.png`);
  $('#botName').text(data.bot.cached.username);
  $('#summary').text(data.summary)

  console.log(data)

})

function vote() {

  if ($('#submitButton').text() === 'Login to vote') {
    document.cookie = `redirect=${document.documentURI}`;
    return window.location = 'https://tea-list.glitch.me/login';
  }

  socket.emit('upvote', {
    id: ID,
    bearer: getCookie('bearer')
  })

}

socket.on('upvoteCallback', function(data) {
  console.log(data)
  if (data === 'RECENTLY VOTED') return $('#alert').attr('class', 'alert').addClass(`alert-danger`).text('Sorry, you already voted for this bot in the past 24 hours.');
  if (data === 'INVALID BEARER') return $('#alert').attr('class', 'alert').addClass(`alert-danger`).text('Sorry, your session has expired, please refresh the page.');

  return $('#alert').attr('class', 'alert').addClass('alert-success').html('Successfully voted! You can vote again in <b>12ours</b>.');

})

socket.on('ping', () => {
  socket.emit('pong');
});