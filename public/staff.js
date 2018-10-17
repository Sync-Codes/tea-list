/*globals io, Qs*/
/*global io, getCookie, invalid, forceLogin*/
let socket = io(),
    sent = false;

/* ===== ======= */
// LOGIN FEATURE //
// LOGIN FEATURE //
/* ===== ======= */

let bearer = getCookie("bearer");
if (bearer) {
  socket.emit('fetchInfo', bearer);
  socket.on('fetchInfoCallback', function(data) {
    $('#discordUsername').text(data.username);
    $('#discordUsernameDrop').removeAttr('style');
    $('#discordWidget').attr('src', `https://discordapp.com/widget?id=343572980351107077&theme=dark&username=${data.username}`)
  })
} else {
   forceLogin()
  document.cookie = `redirect=${document.documentURI}`;
 $('#loginButton').html('<a href="https://discordapp.com/api/oauth2/authorize?client_id=466798921637953546&redirect_uri=https%3A%2F%2Ftea-list.glitch.me%2Fcallback&response_type=code&scope=identify%20guilds"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>')

}

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
  sendAlert('success', 'Submitting, please wait...');
  socket.emit('submitStaff', data);
  socket.on('submitStaffCallback', function(res){
    window.location = `https://tea-list.glitch.me/`;
  })
  
}

function sendAlert(type, msg) {
  $('#alert').addClass('alert').addClass(`alert-${type}`).text(msg);
}
socket.on('ping', () => {
  socket.emit('pong');
});