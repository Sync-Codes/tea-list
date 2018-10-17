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
    if (!data) return $('#loginButton').html('<a href="https://discordapp.com/api/oauth2/authorize?client_id=466798921637953546&redirect_uri=https%3A%2F%2Ftea-list.glitch.me%2Fcallback&response_type=code&scope=identify%20guilds"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>');
    $('.username').text(data.username);
    $('#discordUsernameDrop').removeAttr('style');
  })
} else {
  document.cookie = `redirect=${document.documentURI}`;
  $('#loginButton').html('<a href="https://discordapp.com/api/oauth2/authorize?client_id=466798921637953546&redirect_uri=https%3A%2F%2Ftea-list.glitch.me%2Fcallback&response_type=code&scope=identify%20guilds"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>')
}

socket.emit('fetchBotInfo', {
  id: ID,
  bearer: getCookie('bearer')
});
socket.on('fetchBotInfoCallback', function(data) {
  
  if (data.acc && data.owners && data.owners.includes(data.owners)) $('#ownerStatus').attr("class", "alert text-center alert-dismissible fade show").addClass(`alert-dark`).html(`You are the owner of this bot<br><b>Status: ${data.status}</b><button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>`);
  if (typeof data.bot === 'string') return $('#ownerStatus').attr("class", "alert text-center").addClass(`alert-dark`).html(`<b>We were unable to find a bot with this ID, sorry!</b>`);

  var converter = new showdown.Converter({
      strikethrough: true,
      simplifiedAutoLink: true,
      tables: true,
      underline: true,
      tasklists: true
    }),
    text = data.description,
    html = converter.makeHtml(text);

 if (data.acc && data.owners && data.owners.includes(data.acc.id)) console.log('Owner Detected'), $('#ownerPanel').removeAttr('style')
  if (data.acc && data.acc.staff) console.log('Staff Detected'), $('#staffPanel').removeAttr('style')
  document.title = data.bot.cached.username;
  if (data.bot.presence) {

    let presence = data.bot.presence.status;
    $('#presence').text(presence);
    if (presence === 'offline') $('#presenceBadge').addClass('grey');
    else if (presence === 'online') $('#presenceBadge').addClass('green');
    else if (presence === 'dnd') $('#presenceBadge').addClass('red');
    else if (presence === 'streaming') $('#presenceBadge').addClass('purple');
    else if (presence === 'idle') $('#presenceBadge').addClass('orange');

  } else $('#presenceBadge').addClass('grey'), $('#presence').text('Not Available');

  if (data.featured) $('#featured').attr('style', 'padding-top: 10px;');

  let servers;
  if (data.servers) $('#shields').append(`<span class="badge badge-info">Servers: <b>${data.servers}</b></span>`)

  let users;
  if (data.users) $('#shields').append(`<span class="badge badge-info">Users: <b>${data.users}</b></span>`)
  
  if (data.votes instanceof Array) $('#shields').append(`<span class="badge badge-dark">Upvotes: <b>${data.votes.length}</b></span>`);
  else $('#shields').append(`<span class="badge badge-dark">Upvotes: <b>0</b></span>`);
  
  $('#upvote').attr('href', `https://tea-list.glitch.me/upvote?${data.id}`)
  $('#owner').text(`${data.owner.username}  #${data.owner.discriminator}`)
  $('#tags').text(data.tags);
  $('#icon').attr('src',`https://cdn.discordapp.com/avatars/${data.bot.cached.id}/${data.bot.cached.avatar}.png`);
  
  $('#botName').text(data.bot.cached.username);
  $('#summary').text(data.summary)
  $('.prefix').text(data.prefix);
  $('#helpCommand').text(data.helpCommand);
  $('#library').text(data.library);
  $('#description').html(html);
  $('#invite').attr('href', data.customInviteURL || `https://discordapp.com/oauth2/authorize?client_id=${data.id}&scope=bot`)
  if (data.github) {
    if (!data.github.startsWith('https://') && !data.github.startsWith('http://')) data.github = `http://${data.github}`;
    $('#github').attr('href', data.github).html('<button type="button"  class="btn btn-sm social">GitHub<i class="fa fa-github ml-2"></i></button>')
  }
  if (data.website) {
    if (!data.website.startsWith('https://') && !data.website.startsWith('http://')) data.website = `http://${data.website}`;
    $('#website').attr('href', data.website).html('<button type="button"  class="btn btn-sm social">Website<i class="fa fa-window-restore ml-2"></i></button>')
  }

  console.log(data)

})

function adminAction(action) {
  if (action === 'edit') return location.replace(`https://tea-list.glitch.me/edit?${ID}`);
  let info;
  if (action === 'feature') {
    info = prompt('Do you want to feature this bot? Type `true` or `false`.');
    info = info.toLowerCase();
    if (!['true', 'false'].includes(info)) return;
  } else {
    if (action !== 'approve') info = prompt(`Please include a reason for this action.`);
    else info = confirm('Are you sure?');
    if (!confirm) return;
    if (!info && ['reject', 'remove'].includes(action)) return alert('Please include a reason.');
  }
  socket.emit('adminAction', {
    id: ID,
    action: action,
    bearer: getCookie('bearer'),
    info: info
  });
  if (action === 'remove') return location.replace(`https://tea-list.glitch.me/`);
}

socket.on('ping', () => {
  socket.emit('pong');
});