/*global io, getCookie, invalid*/
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
  document.cookie = `redirect=${document.documentURI}`;
  $('#loginButton').html('<a href="https://tea-list.glitch.me/login"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>')
}

socket.emit('fetchBotInfo', {
  id: ID,
  bearer: getCookie('bearer')
});
socket.on('fetchBotInfoCallback', function(data) {
  if (data === 'INVALID BOT') return location.replace('https://tea-list.glitch.me/');
  if (data.acc && data.owners.includes(data.acc.id)) $('#ownerStatus').attr("class", "alert text-center alert-dismissible fade show").addClass(`alert-dark`).html(`You are the owner of this bot<br><b>Status: ${data.status}</b><button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>`);
  if (typeof data.bot === 'string') return $('#ownerStatus').attr("class", "alert text-center").addClass(`alert-dark`).html(`<b>We were unable to find a bot with this ID, sorry!</b>`);

  if (data.acc && data.acc.staff) console.log('Staff Detected'), $('#staffPanel').removeAttr('style')
  document.title = data.bot.cached.username;
  $('#tags').val(data.tags)
  $('.botName').text(data.bot.cached.username);
  $('#clientID').val(data.id);
  $('#summary').val(data.summary)
  $('#prefix').val(data.prefix);
  $('#helpCommand').val(data.helpCommand);
  $('#library').val(data.library);
  $('#description').html(data.description);
  $('#invite').attr('href', data.customInviteURL || `https://discordapp.com/oauth2/authorize?client_id=${data.bot.id}&scope=bot`)
  if (data.github) $('#github').val(data.github)
  if (data.website) $('#website').val(data.website)
  if (data.customInviteURL) $('#customInviteURL').val(data.customInviteURL)

  console.log(data)

})

let submitted = false;

function submit() {

  // Collect Data
  let data = {
    id: ID,
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
  }

  // Verify Data
  let valid = true;
  
  if (!data.prefix) valid = false, invalid('#prefix');
  if (!data.helpCommand) valid = false, invalid('#helpCommand');
  if (!data.library || data.library === 'Choose...') valid = false, invalid('#library');
  if (!data.summary) valid = false, invalid('#summary');
  if (data.summary.length > 140) valid = false, invalid('#summary');

  if (!data.bearer) return $('#valid').addClass('alert').addClass(`alert-danger`).text('This session has expired, please refresh the page.');
  if (data.summary.length > 140) return $('#valid').addClass('alert').addClass(`alert-danger`).text('Please ensure the summary is no greater than 128 characters..');
  if (!valid) return $('#valid').addClass('alert').addClass(`alert-danger`).text('Please ensure all required fields are filled.');
  submitted = true;
  $('#valid').attr("class", "alert").addClass(`alert-success`).text('Sending... Please wait!');

  // Parse Data
  if (data.helpCommand.startsWith(data.prefix)) data.helpCommand = data.helpCommand.slice(data.prefix.length);
  for (var i in data) {
    data[i] = data[i].replace(/</g, '');
  }

  // Emit Data
  socket.emit('editBot', data);

}

function remainingSummary() {
  $('#remainingSummary').text(`${(140 - $('#summary').val().length)} characters remaining.`)
}

socket.on('editBotCallback', function(data) {
  
  if (data === 'NOT OWNER') return $('#valid').attr('class', 'alert').addClass(`alert-danger`).text('Sorry, you are not the owner of this bot.');

  location.replace(`https://tea-list.glitch.me/bot?${data}`);

})

socket.on('ping', () => {
  socket.emit('pong');
});