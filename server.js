const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io')(server),
  db = require('quick.db'),
  port = process.env.PORT,
      	 passport = require('passport')
	, Strategy = require('passport-discord').Strategy,
      	 bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser'),
  tools = require('./fs.js'),
        url = require('url'),
      ClientOauth = require('client-oauth2'),
  Discord = require('discord.js'),
      
  client = new Discord.Client({
    fetchAllMembers: true
  })
, path     = require('path')
//const  discord = require('./discord.js')(client)
const  qs = require('qs');
const discord = require("./discord.js")(client)
const Enmap = require('enmap');
const EnmapSQLite = require('enmap-sqlite');

client.db = new Enmap({
  provider: new EnmapSQLite({
    name: 'database'
  })
});



client.db.defer.then(() => console.log(`Bot's I serve ${client.db.size}`));
// Listen To Port
server.listen(port, function() {
  console.log(`Listening at port ${port}`);    //to start 
})
const config = require("./config.json")
process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});
// Configure OAuth2
let ops = {
		clientId: "---",
		clientSecret: "---",
		
  accessTokenUri: 'https://discordapp.com/api/oauth2/token',
  authorizationUri: 'https://discordapp.com/api/oauth2/authorize',
  redirectUri: 'https://tea-list.glitch.me/callback',
  scopes: ['identify', 'guilds']
};

let auth = new ClientOauth(ops),
  host = url.parse(ops.redirectUri)
  
app.get('/callback', function(request, response) {
  let res = response
  auth.code.getToken(request.originalUrl).then(user => {
    let bearer = user.accessToken;
    console.log(user)
    response.cookie("bearer", bearer);
    if (!request.cookies)return res.redirect('/')
    else response.redirect(request.cookies.redirect);
  }).catch(e => {
    console.log(e)
    response.status(401).send(e.stack);
  });
});
  app.get('/logout', checkAuth, (req, res) => {
        req.logout();
        res.redirect('/');
    });
   app.get("/login", (req, res, next) => {
  res.redirect (`https://discordapp.com/api/oauth2/authorize?client_id=466798921637953546&redirect_uri=https%3A%2F%2Ftea-list.glitch.me%2Fcallback&response_type=code&scope=identify%20guilds`)
})


	function checkAuth(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

let bot = client;
app.get('/index', (req, res) => {
let e =bot.guilds.get("464446382162313227") 
let mem = e.memberCount
let ava = e.iconURL
  res.render(process.cwd() + '/views/index.ejs', {members: mem , icon: ava});


});

app.get('/about', (req, res) => {
let e =bot.guilds.get("464446382162313227") 
let mem = e.memberCount
let ava = e.iconURL
  res.render(process.cwd() + '/views/about.ejs', {members: mem , icon: ava});


});
   app.get('/queue', function(request, response) {
  response.sendFile(__dirname + '/public/queue.html');
});

app.get('/profile/:id', (req, res) => {
client.fetchUser(req.params.id).then(async e => {
let username =e.username
let dic = e. discriminator
let  ava = e.displayAvatarURL.split('?')[0]

  let status;
  let pic;
  let p;
  let out = [];
  let id = e.id
     let all = client.db.array().reverse();
   all = all.filter(i => i.id && i.status && i.bot && i.bot.cached && id == i.owners[0]).forEach(async member => {
        let hh;
      
         //if(member == null)out = "";
       //if (data.length === 0) {
       // if(member.length === 0)hh = `${username} Has no BOts`
      client.fetchUser(member.id).then(async f=> {
      
out[out.length] = {
  id: member.id,
  avatar: `https://cdn.discordapp.com/avatars/${member.id}/${f.avatar}.png`,
  username: f.username,
  summary: member.summary
}
       console.log(out)
      
        
  if(!out) out = ""
if (out.length === 0) out = ""
 let desciption = await db.fetch(`desc_${e.id}`)
 if(desciption === null)p = `${username} Has NOT Enabled This Feature`
  if(e.id === "338192747754160138")status = `Creator of Tea List`
  if(e.id === "338192747754160138")pic = `https://discordapp.com/assets/779fb0d7cf9afd16249ff8f82f0450e4.svg`
  if(e.id === "364007557045551106")status = `${username} is a Staff Member`
  if(e.id === "297096161842429963" )status = `${username} is a Staff Member`
  if(e.id === "229086637689274368")status = `${username} is a Staff Member`
  if(e.id === "364007557045551106" ) pic = `https://discordapp.com/assets/e4d52f4d69d7bba67e5fd70ffe26b70d.svg`
  if(e.id === "297096161842429963" ) pic = `https://discordapp.com/assets/e4d52f4d69d7bba67e5fd70ffe26b70d.svg`
  if(e.id === "229086637689274368") pic = `https://discordapp.com/assets/e4d52f4d69d7bba67e5fd70ffe26b70d.svg`
res.render(process.cwd() + '/views/profile.ejs', {user: username , avatar:ava , dic:dic , stat:status ,  pic:pic , d:desciption , p:p , memberData:out })
        })
       
   })
})
})
                                       
        

    





app.get("/",  (req, res) => {
let e =bot.guilds.get("464446382162313227") 
let mem = client.users.size - 1
let ava = e.iconURL
  res.render(process.cwd() + '/views/index.ejs', {members: mem , icon: ava});
})
app.use(express.static('public'));
app.use(cookieParser());
app.get('/upvote', function(request, response) {
  response.sendFile(__dirname + '/public/upvote.html');
});
app.get("/suggest", function(request, response) {
  response.sendFile(__dirname + '/public/suggest.html');
})
app.get("/bug", function(request, response) {
  response.sendFile(__dirname + '/public/bug.html');
})
app.get("/request", function(request, response) {
  response.sendFile(__dirname + '/public/request.html');
})
app.get("/view", function(request, response) {
  response.sendFile(__dirname + '/public/view.html');
})
app.get('/docs', function(request, response) {
  response.sendFile(__dirname + '/public/docs.html');
});
app.get("/staff", function(request, response) {
  response.sendFile(__dirname + '/public/staff.html');
})
app.get("/add", function(request, response) {
  response.sendFile(__dirname + '/public/add.html');
})
app.get("/bots", function(request, response) {
  response.sendFile(__dirname + '/public/bots.html');
})
app.get('/bot', function(request, response) {
  response.sendFile(__dirname + '/public/bot.html');
});
app.get('/myBots', function(request, response) {
  response.sendFile(__dirname + '/public/myBots.html');
});
app.get('/edit', function(request, response) {
  response.sendFile(__dirname + '/public/edit.html');
});

app.get('/api', function(request, response) {
  
  // Set Headers
  response.setHeader('Content-Type', 'application/json');
  
  // Fetch Parameters
  let params = request.query.key.split('?');
  
  // Create Res Object
  let res = {
    err: null
  };
  
  // Validate Request
  if (!params || !params[2]) {
    res.err = 'Invalid Request';
    return response.send(res);
  } else if (!client.db.get(`keyPool`).includes(params[0])) {
    console.log(client.db.get(`keyPool`));
    res.err = 'Invalid Key';
    return response.send(res);
  }
  
  res.requestType = params[1]
  res.request = params[2]
  //console.log(res)
  // Form Response
  if (res.requestType === 'botInfo') {
    res.res = client.db.get(res.request);
    if (!res.res) res.err = 'Unable to find ID';
  }
  if (res.requestType === 'postServers') {
    res.request = res.request.split('/');
    if (!res.request[1]) return response.send({ err: 'Invalid Request' });
    if (client.db.get(`key_${res.request[0]}`) !== params[0]) return response.send({ err: 'Invalid Request' });
    let botInfo = client.db.get(res.request[0]);
    botInfo.servers = res.request[1];
    client.db.set(res.request[0], botInfo);
  }

  
  // Send Callback
  response.send(res);
  
});

function fetchUserInfo(entry) {
  const init = new Promise(async resolve => {
    console.log(entry)
    client.fetchUser(entry.owners).then(i => {
      resolve(i);
    }).catch(err => {
      resolve('Unknown User');
    })
  })
  return init;
}
function fetchUserIn(entry) {
  const init = new Promise(async resolve => {
    console.log(entry)
    client.fetchUser(entry.id).then(i => {
      resolve(i);
    }).catch(err => {
      resolve('Unknown User');
    })
  })
  return init;
}
function fetchBotInfo(ID) {
  const init = new Promise(async resolve => {
    let member;
    try {
      member = client.guilds.get('464446382162313227').members.get(ID);
    } catch (e) {};
    client.fetchUser(ID).then(i => {
      if (!i.bot) i = 'User Account'
      if (!member) member = {};
      let fetched = client.db.get(i.id);
      if (!fetched) fetched = {};
      fetched.bot = {
        cached: i,
        presence: member.presence || undefined
        
      };
      client.db.set(i.id, fetched)
      resolve({
        cached: i,
        presence: member.presence
      });
    }).catch(err => {
      resolve('Unknown User');
    })
  })
  return init;
}


let dbCache = new Map();
io.on('connection', function(socket) {

  // Request Entries
  socket.on('requestEntries', async function() {
    console.log('New Data Request');
    let entries = await db.fetch('entries');
    if (!entries) entries = {};
    entries = Object.values(entries);
    entries = entries.filter(e => e.approved && e.type !== 'request');
    entries = entries.reverse();
    socket.emit('requestEntriesCallback', entries);
  })
    socket.on('fetchTags', function(tag) { // Fetches all bots with the specified tag
    let all = client.db.array().reverse();
    all = all.filter(i => i.tags && i.tags.toLowerCase().includes(tag.toLowerCase()));
    socket.emit('fetchTagsCallback', all);
  })
  
  socket.on('fetchKey', function(data) {
    if (!data.bearer) return;
    const baseApiUrl = 'https://discordapp.com/api/';
    snekfetch.get(`${baseApiUrl}users/@me`)
      .set("Authorization", "Bearer " + data.bearer).then(user => {
        let keyPool = client.db.get('keyPool');
        if (!keyPool) keyPool = [];
        let fetched = client.db.get(data.id);
        if (!fetched.owners.includes(user.body.id)) return socket.emit('fetchKeyCallback', 'INVALID BEARER');
        let fetchedKey = client.db.get(`key_${data.id}`);
        if (!fetchedKey || data.forceUpdate) {
          if (fetchedKey && keyPool.includes(fetchedKey)) keyPool.splice(keyPool.indexOf(fetchedKey), 1);
          fetchedKey = tools.generateKey()
          keyPool.push(fetchedKey);
          console.log(`Bots Key:  ${fetchedKey}`)
          client.db.set(`key_${data.id}`, fetchedKey);
          client.db.set(`keyPool`, keyPool);
        }
        socket.emit('fetchKeyCallback', { id: data.id, key: fetchedKey });
      }).catch(err => {
        console.log('Invalid Login - fetchKey', err);
        socket.emit('fetchKeyCallback', 'INVALID BEARER');
      });
  })
  
    socket.on('submitBug', async function(data) {
    let key = await tools.generateKey('entries');
    data.type = 'bugreport';
    data.status = false;
    data.key = key;
    await db.set('entries', data, {
      target: key
    });
    socket.emit('submitBugCallback', key);
    if (!data.serverBug) client.emit('newBug', key);
  })
   socket.on('submitStaff', async function(data) {
      const baseApiUrl = 'https://discordapp.com/api/';
      console.log(data)
    snekfetch.get(`${baseApiUrl}users/@me`)
      
      .set("Authorization", "Bearer " + data.bearer).then(async user => {
    let key = await tools.generateKey('entries');
      
      client.fetchUser(user.body.id).then(async url => {
       let u = url.avatarURL
    data.type = 'application';
    data.status = false;
    data.key = key;
     
    await db.set('entries', data, {
      target: key
      
    });
         await db.set('en', u, {
      target: key
      
    });
      await db.set('us', user.body.id,{
        target: key
      })
    socket.emit('submitStaffCallback', key);
    if (!data.serverStaff) client.emit('newStaff', key);
      })
    })

  })
   socket.on('submitRequest', async function(data) {
       const baseApiUrl = 'https://discordapp.com/api/';
      console.log(data)
    snekfetch.get(`${baseApiUrl}users/@me`)
      
      .set("Authorization", "Bearer " + data.bearer).then(async user => {
    let key = await tools.generateKey('entries');
      
      client.fetchUser(user.body.id).then(async url => {
       let u = url.avatarURL
    data.type = 'application';
    data.status = false;
    data.key = key;
     
    await db.set('entries', data, {
      target: key
      
    });
         await db.set('en', u, {
      target: key
      
    });
      await db.set('us', user.body.id,{
        target: key
      })
    socket.emit('submitRequestCallback', key);
    if (!data.serverRequest) client.emit('newRequest', key);
      })
    }).catch(err => {
        console.log('Invalid Login - Staff Submit', err);
        socket.emit('submitRequestCallback', 'INVALID BEARER')

      });
  })
  socket.on('requestBug', async function(data) {
    let entries = await db.fetch('entries');
    if (!entries) entries = {};
    entries = Object.values(entries);
    entries = entries.filter(e => e.type === 'suggestion' && !e.serverSuggestion);
    entries = entries.reverse();
    socket.emit('requestBugCallback', entries);
  })
  
  
  
  
  
  
  const snekfetch = require('snekfetch')
    socket.on('submitBot', async function(data) {
      const baseApiUrl = 'https://discordapp.com/api/';
      console.log(data)
    snekfetch.get(`${baseApiUrl}users/@me`)
      
      .set("Authorization", "Bearer " + data.bearer).then(async user => {

        if (client.db.get(data.id)) return socket.emit('submitBotCallback', 'ALREADY SUBMITTED')

        let botInfo = await fetchBotInfo(data.id);
        console.log(`Bot Info:`+botInfo)
        if (typeof botInfo === 'string') return socket.emit('submitBotCallback', 'INVALID');
let entry = user.body
      let editor = await fetchUserIn(entry);
   
        // Valid Data
        data = {
          id: data.id || '',
          prefix: data.prefix || '',
          helpCommand: data.helpCommand || '',
          library: data.library || '',
          summary: data.summary || '',
          description: data.description || '',
          github: data.github || '',
          website: data.website || '',
          customInviteURL: data.customInviteURL || '',
          createdTimestamp: Date.now(),
          lastEdited: Date.now(),
          status: 'Awaiting Verification',
          bot: botInfo,
          owners: [user.body.id],
          tags: data.tags || ''
        }
       
client.db.set(data.id, data);
  socket.emit('submitBotCallback', data.id);
     
            
      client.emit('log', `**${botInfo.cached} was submitted by ${editor}\n(https://tea-list.glitch.me/bot?${botInfo.cached.id})**`);
    })
    })
  
    socket.on('fetchInfo', function(bearer) {
    if (!bearer) return;
      const baseApiUrl = 'https://discordapp.com/api/';
    snekfetch.get(`${baseApiUrl}users/@me`)
      .set("Authorization", "Bearer " + bearer).then(user => {
        console.log(`${user.body.username}#${user.body.discriminator} (ID: ${user.body.id})`)
        socket.emit("fetchInfoCallback", user.body);
      }).catch(err => {
        console.log('Invalid Login - fetchInfo');
        socket.emit('fetchInfoCallback', 'INVALID BEARER')
      });
  })

    socket.on('adminAction', async function(data) {
      const baseApiUrl = 'https://discordapp.com/api/';
      let ga = client.guilds.get('464446382162313227')
    snekfetch.get(`${baseApiUrl}users/@me`)
      .set("Authorization", "Bearer " + data.bearer).then(async user => {
        let entry = client.db.get(data.id);
        let staff = client.db.get('staff') 
        if (!staff.includes(user.body.id)) return;
        let bot = await fetchBotInfo(data.id);
        let author = await fetchUserInfo(entry)
        let boi = author.id
      console.log(`${entry.status}`)
        let approver = user.body.id
        if (data.action === 'remove') {
          client.db.delete(data.id);
          if (data.info !== true) client.emit('log', `**${author}, ${bot.cached} has been removed by <@${approver}>!\nReason: ${data.info}\n(https://tea-list.glitch.me/bot?${bot.cached.id})**`);
          else client.emit('log', `**${author}, ${bot.cached} has been removed by ${approver}!\n(https://tea-list.glitch.me/bot?${bot.cached.id})**`);
        }


        if (!staff.includes(user.body.id)) return;
        if (data.action === 'approve') {
let stat;
        stat = {
          status: 'Approved',
          owners: author.id
        }
          entry.status = "Approved"
       client.db.set(data.id,entry)
          io.emit('updated', entry);
          client.emit('log', `**${author}, ${bot.cached} has been approved by <@${approver}>!\n(https://tea-list.glitch.me/bot?${bot.cached.id})**`);
       // let role = ga.roles.find("name","Developer")
      //  boi.addRole(role.id)
        } else if (data.action === 'reject') {
          if (!data.info) data.info = 'No Reason Provided';
             entry.status = "Rejected"
       client.db.set(data.id,entry)
          client.emit('log', `**${author}, ${bot.cached} has been rejected by <@${approver}>.\nReason: ${data.info}\n(https://tea-list.glitch.me/bot?${bot.cached.id})**`);
        } else if (data.action === 'feature') {
          if (data.info === 'true') {
            entry.featured = true;
            client.db.set(data.id, entry);
            client.emit('log', `**${author}, ${bot.cached} has been featured by <@${approver}>.\n(https://tea-list.glitch.me/bot?${bot.cached.id})**`);
            
            
          } else if (data.info === 'false') {
            entry.featured = false;
            client.db.set(data.id, entry);
            client.emit('log', `**${author}, ${bot.cached} is not longer being featured.\n(https://tea-list.glitch.me/bot?${bot.cached.id})**`);
          }
        }
      }).catch(err => console.log('Invalid Admin Action', err));
  })

   socket.on('fetchPublic', async function(data) {
    let all = client.db.array().reverse();
    all = all.filter(i => i.status === 'Approved');
    socket.emit('fetchPublicCallback', all);
  })

  socket.on('fetchQueue', async function(data) {
    let all = client.db.array().reverse();
    all = all.filter(i => i.id && i.status && i.bot && i.bot.cached && i.status !== 'Approved');
    console.log(all)
    socket.emit('fetchQueueCallback', all);
  })

  socket.on('fetchMyBots', async function(id) {
    let all = client.db.array().reverse();
    all = all.filter(i => i.id && i.status && i.bot && i.bot.cached && id == i.owners[0]);
    socket.emit('fetchMyBotsCallback', all);
  })

function fetchU(ID) {
  const init = new Promise(async resolve => {
    client.fetchUser(ID).then(i => {
      resolve(i);
    }).catch(err => {
      resolve('Unknown User');
    })
  })
  return init;
}
  
  
    socket.on('fetchBotInfo', async function(info) {
    let data = client.db.get(info.id);
    if (!data) return socket.emit('fetchBotInfoCallback', 'INVALID BOT');
const baseApiUrl = 'https://discordapp.com/api/';
    if (info.bearer) data.acc = await snekfetch.get(`${baseApiUrl}users/@me`).set('Authorization', 'Bearer ' + info.bearer).catch(err => data.acc = false)
    if (data.acc) data.acc = data.acc.body;
    data.bot = await fetchBotInfo(info.id);
      console.log(`Owner: ${data.owners}`)
    data.owner = await client.fetchUser(data.owners)
      
    if (data.acc && client.db.get('staff') && client.db.get('staff').includes(data.acc.id)) data.acc.staff = true;
    socket.emit('fetchBotInfoCallback', data);
     
  })
  
  
    socket.on('editBot', async function(data) {
      const baseApiUrl = 'https://discordapp.com/api/';
    snekfetch.get(`${baseApiUrl}users/@me`)
      .set("Authorization", "Bearer " + data.bearer).then(async user => {
      console.log(data)
        let fetched = client.db.get(data.id);
      
        let staff = client.db.get('staff');
        if (!fetched.owners.includes(user.body.id) && !staff.includes(user.body.id)) return socket.emit('editBotCallback', 'NOT OWNER');
        let botInfo = await fetchBotInfo(data.id);

        data = {
          id: fetched.id,
          prefix: data.prefix || '',
          helpCommand: data.helpCommand || '',
          library: data.library || '',
          summary: data.summary || '',
          description: data.description || '',
          github: data.github || '',
          website: data.website || '',
          customInviteURL: data.customInviteURL || '',
          createdTimestamp: fetched.createdTimestamp,
          lastEdited: Date.now(),
          status: fetched.status,
          bot: botInfo,
          owners: fetched.owners,
          tags: data.tags || '',
          featured: fetched.featured || '',
          votes: data.votes || []
        }

        // Parse Data
        if (data.helpCommand.startsWith(data.prefix)) data.helpCommand = data.helpCommand.slice(data.prefix.length);
        for (var i in data) {
          if (typeof data[i] === 'string') data[i] = data[i].replace(/</g, '');
        }

        client.db.set(data.id, data);
        io.emit('updated', data);
        socket.emit('editBotCallback', data.id);
let entry = user.body
        let editor = await client.fetchUser(entry)
        client.emit('log', `**${botInfo.cached} was edited by ${editor}\n(https://tea-list.glitch.me/bot?${botInfo.cached.id})**`);
       


      })
  });
  
    socket.on('upvote', async function(data) {
          const baseApiUrl = 'https://discordapp.com/api/';
    snekfetch.get(`${baseApiUrl}users/@me`)
      .set("Authorization", "Bearer " + data.bearer).then(async user => {
        user = user.body;
        let lastVoted = client.db.get(`lastVoted_${user.id}_${data.id}`);
        let bot = client.db.get(data.id);
        if (!lastVoted || 4.32e+7 - (Date.now() - lastVoted) < 0) { // Allowed to vote
          client.db.set(`lastVoted_${user.id}_${data.id}`, Date.now());
          if (!bot.votes) bot.votes = [user.id];
          else bot.votes.push(user.id);
          bot.lastEdited = Date.now();
          client.db.set(data.id, bot);
          socket.emit('upvoteCallback', true);
          client.emit('bo', `**<@${bot.id}> Was just Upvoted by <@${user.id}> (https://tea-list.glitch.me/bot?${bot.id})**`);
          io.emit('updated', bot);
        } else { // Recently voted
          socket.emit('upvoteCallback', 'RECENTLY VOTED');
        }
      }).catch(err => {
        console.log(err);
        socket.emit('upvoteCallback', 'INVALID BEARER');
      })
  })
})