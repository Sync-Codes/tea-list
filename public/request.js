/*globals io, Qs*/
/*global io, getCookie, invalid, forceLogin*/
let socket = io();



let bearer = getCookie("bearer");
if (bearer) {
  socket.emit('fetchInfo', bearer);
  socket.on('fetchInfoCallback', function(data) {
    if (!data) return $('#loginButton').html('<a href="https://tea-list.glitch.me/login"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>');
    $('.username').text(data.username);
    $('#discordUsernameDrop').removeAttr('style');
  })
} else {
   forceLogin()
  document.cookie = `redirect=${document.documentURI}`;
  $('#loginButton').html('<a href="https://tea-list.glitch.me/login"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>')
}
let sent = true

function submit() {
 
  let data = {
      username: $('#usernameInput').val(),
      title: $('#titleInput').val(),
      desc: $('#descInput').val(),
        bearer: getCookie('bearer')
  },
      valid = true;

  for (var i in data) if (data[i] === undefined || data[i] === '') valid = false;
  if (!valid) return sendAlert('danger', 'Please verify all fields are filled');
  if (sent) return;
  sent = true;
  sendAlert('success', 'Sending, please wait...');
  socket.emit('submitRequest', data);
  socket.on('submitRequestCallback', function(res){
    window.location = `https://tea-list.glitch.me/index`;
  })
  
}

function sendAlert(type, msg) {
  $('#alert').addClass('alert').addClass(`alert-${type}`).text(msg);
}