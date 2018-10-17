/*globals io, Qs*/
/*global io, getCookie, invalid, forceLogin*/
let socket = io(),
    sent = false;

let bearer = getCookie("bearer");
if (bearer) {
  socket.emit('fetchInfo', bearer);
  socket.on('fetchInfoCallback', function(data) {
    socket.emit('fetchMyBots', data.id);
    $('#discordUsername').text(data.username);
    $('#discordUsernameDrop').removeAttr('style');
    $('#discordWidget').attr('src', `https://discordapp.com/widget?id=343572980351107077&theme=dark&username=${data.username}`)
  })
} else {
  document.cookie = `redirect=${document.documentURI}`;
   forceLogin()
  $('#loginButton').html('<a href="https://discordapp.com/api/oauth2/authorize?client_id=444754026551050251&redirect_uri=https%3A%2F%2Fbots.plexidev.org%2Fcallback&response_type=code&scope=identify"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>')
}

function remainingSummary() {
  $('#remainingSummary').text(`${(140 - $('#summary').val().length)} characters remaining.`)
}

let submitted = false;

function submit() {

  // Collect Data
  let data = {
    id: $('#clientID').val(),
    prefix: $('#prefix').val(),
    helpCommand: $('#helpCommand').val(),
    library: $('#library').val(),
    summary: $('#summary').val(),
    description: $('#description').val(),
    github: $('#github').val(),
    website: $('#website').val(),
    customInviteURL: $('#customInviteURL').val(),
   bearer: getCookie('bearer'),
    tags: $('#tags').val()
  },

  // Verify Data
     valid = true;


 

  if (!data.id || isNaN(data.id)) valid = false, invalid('#clientID');
  if (!data.prefix) valid = false, invalid('#prefix');
  if (!data.helpCommand) valid = false, invalid('#helpCommand');
  if (!data.library || data.library === 'Choose...') valid = false, invalid('#library');
  if (!data.summary) valid = false, invalid('#summary');
  if (data.summary.length > 140) valid = false, invalid('#summary');

  if (!data.bearer) return $('#valid').addClass('alert').addClass(`alert-danger`).text('This session has expired, please refresh the page.');
  if (data.summary.length > 140) return $('#valid').addClass('alert').addClass(`alert-danger`).text('Please ensure the summary is no greater than 128 characters..');
  if (!valid) return $('#valid').addClass('alert').addClass(`alert-danger`).text('Please ensure all required fields are filled.');
  for (var i in data) if (data[i] === undefined || data[i] === '') valid = false;
  if (!valid) return sendAlert('danger', 'Please verify all fields are filled');
  if (sent) return;
  //let sent = true;
 // Emit Data
   // Parse Data
 
  sendAlert('success', 'Sending, please wait...');
  socket.emit('submitBot', data);
  window.location = `https://tea-list.glitch.me/bot?${data.id}`;
  
}
socket.on('submitBotCallback', function(data) {
   if (data === 'ALREADY SUBMITTED') return sendAlert('danger','This bot has already been submited.');
  if (data === 'INVALID BEARER') return sendAlert('danger','This session has expired, please refresh the page. If this problem perisists, log out then login again.');
  if (data === 'INVALID') return sendAlert('danger','Sorry, we were unable to find a bot with this ID.');
    
  })
function sendAlert(type, msg) {
  $('#alert').addClass('alert').addClass(`alert-${type}`).text(msg);
}

socket.on('ping', () => {
  socket.emit('pong');
});