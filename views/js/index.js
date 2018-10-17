/*global io, getCookie, shuffle, findWithAttr, _*/
let socket = io();
let data = [];
let tab = 'recent';
let tags = {};
let formattedTags = [];

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
    $('#discordWidget').attr('src', `https://discordapp.com/widget?id=464446382162313227&theme=dark&username=${data.username}`)
  })
} else {
  document.cookie = `redirect=${document.documentURI}`;
  $('#loginButton').html('<a href="https://discordapp.com/api/oauth2/authorize?client_id=466798921637953546&redirect_uri=https%3A%2F%2Ftea-list.glitch.me%2Fcallback&response_type=code&scope=identify%20guilds"><button type="button" class="btn btn-sm"> <small class="text-muted"> Login Through Discord </small> </button></a>')
}

/* ===== ==== */
// FETCH BOTS //
// FETCH BOTS //
/* ===== ==== */

function add(prop) {
  if (!tags[prop.toLowerCase()] || typeof tags[prop.toLowerCase()] !== 'number') tags[prop.toLowerCase()] = 1;
  else tags[prop.toLowerCase()]++;
}

socket.emit('fetchPublic');
socket.on('fetchPublicCallback', function(fetched) {
  data = fetched;
  recentView();

  let featured = data.filter(i => i.featured);
  featured = shuffle(featured);
  featured = featured.slice(0, 5);

  for (var i in featured) {

    let votes;
    if (!featured[i].votes) votes = 0;
    else votes = featured[i].votes.length;
    
    let servers;
    if (!featured[i].servers) servers = '';
    else servers = `<span class="badge badge-info">Servers: <b>${featured[i].servers}</b></span>`
    
    let users;
    if (!featured[i].users) users = '';
    else users = `<span class="badge badge-info">Users: <b>${featured[i].users}</b></span>`
    
    let margin = `margin-left: 0px !important;`
    if (i === 0) margin = '';
    
    $("#featured").append(`<div class="col mb-3">
          <div class="card mx-auto" style="width: 18rem;">
            <div class="botIcons card-body" style="${margin}">
              <h5 class="card-title" style="padding-bottom: 0px;">${featured[i].bot.cached.username}</h5>
              <img src="https://cdn.discordapp.com/avatars/${featured[i].bot.cached.id}/${featured[i].bot.cached.avatar}.png">
              <p class="card-text">${featured[i].summary}</p>
              <div>${servers}${users}<span class="badge badge-dark">Upvotes: <b>${votes}</b></span></div>
              <button class="btn btn-sm btn-info" onclick="goto('bot?${featured[i].id}')">View Bot</button>
            </div>
          </div>
        </div>`);

  }
  
  // Organize Tab List
  data.map(function(item) {
    item.tags = item.tags.split(',');
    if (!item.tags instanceof Array) add('No Tags');
    for (var i in item.tags) add(item.tags[i].trim());
  })
  
  for (var i in tags) formattedTags.push({ tag: i, count: tags[i] });
  tags = _.sortBy(formattedTags, 'count').reverse();
  
  for (var i in tags) {
    if (tags[i].count > 1) $('#list-tab').append(`<a class="list-group-item list-group-item-action" id="list-home-list" data-toggle="list" onclick="fetchTag('${tags[i].tag}')" role="tab" aria-controls="home" aria-selected="false"><div class="row"><div class="col-md-4">${tags[i].tag}</div><div class="col-md-4"><span class="badge badge-light">${tags[i].count}</span></div></div></a>`)
  }

})

function sortRated() {
  tab = 'highest'
  console.log('Sorting...');
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("recent");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("tr");
    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("th")[1].getElementsByClassName("upvotes")[0].getElementsByTagName("b")[0];
      y = rows[i + 1].getElementsByTagName("th")[1].getElementsByClassName("upvotes")[0].getElementsByTagName("b")[0];
      if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function recentView() {
  tab = 'recent';
  console.log(data)
  $('#recent').html('');

  for (var i in data) {

    let votes;
    if (!data[i].votes) votes = 0;
    else votes = data[i].votes.length;
    
    let servers;
    if (!data[i].servers) servers = '';
    else servers = `<span class="badge badge-info">Servers: <b>${data[i].servers}</b></span>`

    let users;
    if (!data[i].users) users = '';
    else users = `<span class="badge badge-info">Users: <b>${data[i].users}</b></span>`
    
    let row = $(`<tr timestamp="${data[i].lastEdited}" onclick=goto("bot?${data[i].id}")>`);
    row.append($(`<th scope="row" width="5%"><img src="https://cdn.discordapp.com/avatars/${data[i].bot.cached.id}/${data[i].bot.cached.avatar}.png" class="icon"></th>`))
    row.append($(`<th scope="row" width="80%"><p class="lead" style="margin-bottom: 0px;">${data[i].bot.cached.username}</p><p class="text-muted">${data[i].summary}</p>${servers}${users}<span class="badge badge-dark upvotes">Upvotes: <b>${votes}</b></span></th>`))
    row.append($(`<th scope="row" width="15%"></th>`))

    $("#recent").append(row);

  }

  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("recent");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("tr");
    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getAttribute("timestamp");
      y = rows[i + 1].getAttribute("timestamp");
      if (parseInt(x) < parseInt(y)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }

}

socket.on('updated', function(entry) {
  let index = findWithAttr(data, 'id', entry.id);
  console.log(index)
  if (index === -1) data.push(entry);
  else data.splice(index, 1, entry);
  recentView();
  if (tab === 'highest') sortRated();
});

socket.on('ping', () => {
  socket.emit('pong');
});

function fetchTag(tag) {
  console.log('Fetching', tag);
 socket.emit('fetchTags', tag); 
}

socket.on('fetchTagsCallback', function(fetched) {
  $('#tags').html('');
  console.log(fetched)
  for (var i in fetched) {
    
    let votes;
    if (!fetched[i].votes) votes = 0;
    else votes = fetched[i].votes.length;
  
    let row = $(`<tr onclick=goto("bot?${fetched[i].id}")>`);
    row.append($(`<th scope="row" width="5%"><img src="https://cdn.discordapp.com/avatars/${fetched[i].bot.cached.id}/${fetched[i].bot.cached.avatar}.png" class="icon"></th>`))
    row.append($(`<th scope="row" width="95%"><p class="lead" style="margin-bottom: 0px;">${fetched[i].bot.cached.username}</p><p class="text-muted">${fetched[i].summary}</p><span class="badge badge-dark">Upvotes: <b>${votes}</b></span></th>`))

    $("#tags").append(row);
  
  }
  
})