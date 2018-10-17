/*global io, getCookie, forceLogin*/
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
  forceLogin()
}

/* ===== ==== */
// FETCH INFO //
// FETCH INFO //
/* ===== ==== */

socket.on('fetchMyBotsCallback', function(data) {
  if (data.length === 0) {
    let row = $(`<tr>`);
    row.append($(`<th scope="row" width="100%"><b>You currently don't have any bots.</b></th>`))
    $("#botTable").append(row);
  }

  for (var i in data) {
    let row = $(`<tr>`);
    row.append($(`<th scope="row" width="8%"><img src="https://cdn.discordapp.com/avatars/${data[i].bot.cached.id}/${data[i].bot.cached.avatar}.png" class="icon"></th>`))
    row.append($(`<th scope="row" width="92%"><p class="lead" style="margin-bottom: 0px;">${data[i].bot.cached.username}</p><p class="text-muted">${data[i].summary}</p><div class="input-group-prepend"><span class="input-group-text" onclick="fetchKey('${data[i].id}', false)">Get Key</span><input id="key_${data[i].id}" type="text" class="form-control"><span class="input-group-text" onclick="fetchKey('${data[i].id}', true)">Change Key</span></div></th>`))
    
    $("#botTable").append(row);
  }

})

function fetchKey(id, forceUpdate) {
  socket.emit('fetchKey', { bearer: getCookie('bearer'), id: id, forceUpdate: forceUpdate });
}

socket.on('fetchKeyCallback', function(data) {
  if (data === 'INVALID BEARER') return $('#alert').attr('class', 'alert').addClass(`alert-danger`).text('This session has expired, please refresh the page. If this problem perisists, log out then login again.');
  $(`#key_${data.id}`).val(data.key);
})

socket.on('ping', () => {
  socket.emit('pong');
});