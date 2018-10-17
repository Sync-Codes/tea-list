/*globals io, Qs*/
/*global io, getCookie, invalid, forceLogin*/
let socket = io();

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
  document.cookie = `redirect=${document.documentURI}`;
  forceLogin()
 $('#loginButton').html('<a href="https://discordapp.com/api/oauth2/authorize?client_id=466798921637953546&redirect_uri=https%3A%2F%2Ftea-list.glitch.me%2Fcallback&response_type=code&scope=identify%20guilds"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>')

}

/* ===== ==== */
// FETCH BOTS //
// FETCH BOTS //
/* ===== ==== */

socket.emit('fetchQueue');
socket.on('fetchQueueCallback', function(data) {
  if (data.length === 0) {
    let row = $(`<tr>`);
    row.append($(`<th scope="row" width="100%"><b>No bots remaining.</b></th>`))
     $("#table tbody").append(row); 
  }

  for (var i in data) {
    let action = `<span class="badge badge-danger"><b>Action:</b> Invite To Testing Server</span>`;
    if (data[i].bot.presence) action = `<span class="badge badge-success"><b>Action:</b> Approve</span>`;
    let row = $(`<tr>`);
    row.append($(`<th scope="row" width="5%" onclick=goto("bot?${data[i].id}")><img src="https://cdn.discordapp.com/avatars/${data[i].bot.cached.id}/${data[i].bot.cached.avatar}.png" class="icon"></th>`))
    row.append($(`<th scope="row" width="75%" onclick=goto("bot?${data[i].id}")><p class="lead" style="margin-bottom: 0px;">${data[i].bot.cached.username}</p><p class="text-muted">${data[i].summary}</p></th>`))
    row.append($(`<th scope="row" width="10%">${action}</th>`))
    row.append($(`<th scope="row" width="10%"><a target="_blank" href="https://discordapp.com/oauth2/authorize?client_id=${data[i].id}&scope=bot&permissions=0&guild_id=464446382162313227"><button class="btn btn-outline-dark" style="color: white !important;">Invite</button></a></tg>`))

   $("#table tbody").append(row); 
  }

})

socket.on('ping', () => {
  socket.emit('pong');
});