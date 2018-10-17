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
