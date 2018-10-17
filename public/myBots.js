/*global io, getCookie*/
let socket = io();

/* ===== ======= */
// LOGIN FEATURE //
// LOGIN FEATURE //
/* ===== ======= */

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
  $('#loginButton').html('<a href="https://discordapp.com/oauth2/authorize?client_id=466798921637953546&redirect_uri=https%3A%2F%2Ftea-list.glitch.me%2Fcallback&response_type=code&scope=identify%20guilds"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>')
}

/* ===== ==== */
// FETCH BOTS //
// FETCH BOTS //
/* ===== ==== */

socket.on('fetchMyBotsCallback', function(data) {
  if (data.length === 0) {
    let row = $(`<tr>`);
    row.append($(`<th scope="row" width="100%"><b>You currently don't have any bots.</b></th>`))
    $("#recent").append(row);
  }

  for (var i in data) {
    let row = $(`<tr onclick=goto("bot?${data[i].id}")>`);
    row.append($(`<th scope="row" width="8%"><img src="https://cdn.discordapp.com/avatars/${data[i].bot.cached.id}/${data[i].bot.cached.avatar}.png" class="icon"></th>`))
    row.append($(`<th scope="row" width="92%"><p class="lead" style="margin-bottom: 0px;">${data[i].bot.cached.username}</p><p class="text-muted">${data[i].summary}</p></th>`))

    $("#recent").append(row);
  }

})

socket.on('ping', () => {
  socket.emit('pong');
});