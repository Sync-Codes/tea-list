const db = require('quick.db'),
      Discord = require('discord.js');
const fs = require('fs');
module.exports = function(client) {  
  client.login(process.env.TOKEN);
  let channel;
  let channel2;
  let ch;
  let chh;
  let boo
  client.on('ready', () => {
    console.log('Discord Instance Launched');
    channel = client.channels.get('476785553170497546'); //bot-log
    channel2 = client.channels.get('482678305439612931'); //bot-log in mods section
    ch = client.channels.get('482716320694140956') //bug-log
    chh = client.channels.get('482716769149255713'); //stafflog
     boo = client.channels.get("484525168887201802")
  });
  
  fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];

    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});
 //Bot Task
  
    client.on('newBug', async key => {
  
    let callback = await db.fetch('entries', { target: key });

    const embed = new Discord.RichEmbed()
       .setColor("#00CC99")
      .setTitle('Bug Report')
      
      .setDescription(`**ID:** ${key}\n**Author:** ${callback.username}\n\n**Title:** ${callback.title}\n**Description:** ${callback.desc}\n_ _`)
     
    
    ch.send(embed)
    
  })
    client.on('newRequest', async key => {
  
     let callback = await db.fetch('entries', { target: key });
let user =  await db.fetch('us', { target: key });
      let u =  await db.fetch('en', { target: key });

    const embed = new Discord.RichEmbed()
       .setColor("#00CC99")
      .setTitle('New Request')
          .setDescription(`\n**Author:** <@${user}>\n\n**Title:** ${callback.title}\n**Description:** ${callback.desc}\n_ _`)
      .setThumbnail(`${u}`)
     // .setDescription(`**ID:** ${key}\n**Author:** ${callback.username}\n\n**Title:** ${callback.title}\n**Description:** ${callback.desc}\n_ _`)
      
    
    ch.send(embed)
    
  })
  client.on('log', message => {
    channel.send(message);
  })
    client.on('bo', message => {
      let embed = new Discord.RichEmbed()
      .setTitle("Upvote")
      .setColor("BLURPLE")
      .setDescription(message)
    boo.send(embed);
  })
   client.on('newBot', async data => {
  
   // let callback = await db.fetch('entries', { target: key });

    const embed = new Discord.RichEmbed()
       .setColor("#7289DA")
      .setTitle('New Bot!!')
    //  .addField("Info",`ID: ${data.id}\nName: ${data.name}`)
   //console.log(data)
      
    
    channel.send(embed)
    
  })
    client.on('newStaff', async key => {
  
    let callback = await db.fetch('entries', { target: key });
let user =  await db.fetch('us', { target: key });
      let u =  await db.fetch('en', { target: key });
   

     
     client.fetchUser(user).then(ub =>{
       
    const h = new Discord.RichEmbed()
    .setDescription(`Heyo, I made!! over the ~ ~ waves ~ ~\nWe have recived your staff application please wait up to 2 hours \n(*My staff is are really BUSY*)`)
     .setColor(0xf24946);
    ub.send(h)
     const embed = new Discord.RichEmbed()
              .setColor("#00CC99")
      .setTitle('Staf Application')
      .setURL(`https://tea-list.glitch.me/staff`)
       .setDescription(`To approve it, type: t!approve ${user}\nTo deny it, type: t!deny ${user} (reason)`)
       .addField(`Applicant`,`${ub.username}#${ub.discriminator}(${user})`)
       .addField("Why should we hire him/her",`${callback.desc}`)
       .addField(`Age & Timezone`,`${callback.title}`)
      .setThumbnail(`${u}`)
       let ga = client.guilds.get("464446382162313227")
       let role = ga.roles.find('name','Applications')
    chh.send(embed).then(async e => {
      chh.send(`${role}`)
      
      
      
    })
     })
})
  let prefix = "t!";
  const sql = require("sqlite");
sql.open("./score.sqlite");

client.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.type !== "text") return;

 

   sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
    if (!row) {
      sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
    } else {
      let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
      if (curLevel > row.level) {
        row.level = curLevel;
        sql.run(`UPDATE scores SET points = 0, level = ${row.level} WHERE userId = ${message.author.id}`);
        message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
        db.delete(`user_${message.author.id}`)
        sql.run(`UPDATE scores points = 1 WHERE userId = ${message.author.id}`)
      }
      sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
  
    }
  }).catch(() => {
    console.error;
    sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
      sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
    });
  });

  if (!message.content.startsWith(prefix)) return;

  if (message.content.startsWith(prefix + "level")) {
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) return message.reply("Your current level is 0");
      message.reply(`Your current level is ${row.level}`);
    });
  } else

  if (message.content.startsWith(prefix + "points")) {
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) return message.reply("sadly you do not have any points yet!");
      message.reply(`you currently have ${row.points} points, good going!`);
    });
  }
});
  const { get } = require("snekfetch");
  client.on("message",async message => {
  if (message.author.bot) return;
  if (message.channel.type !== "text") return;
    let member = message.mentions.users.first() || message.author
    const { Attachment } = require("discord.js");
      if (message.content.startsWith(prefix + "profile")) {
      sql.get(`SELECT * FROM scores WHERE userId ="${member.id}"`).then(async row => {
        const name = `${member.username}`
     //     db.fetch(`user_${member.id}`)
        let points = row.points//await db.fetch(`user_${member.id}`)
        
        let r = 100 - points
       
        let c = points * 400/100
    const { body } = await get(`https://dev.anidiots.guide/profile/card?name=${name}&points=${points}&expbar=${c}&remaining=${r}&theme=blurple&level=${row.level}&avatar=${member.avatarURL}`).set("Authorization", process.env.IDIOTAPI);
    await message.channel.send(new Attachment(Buffer.from(body), `profile-${member.id}.jpg`));
      })
      }

  })
  
  client.on("message", async message => {
        if(message.author.bot) return;
        if(message.channel.type === 'dm') return ;
   
 
        


      let prefix = "t!";
      
     
    
     if (message.content == "<@466798921637953546>") {
        const embed2 = new Discord.RichEmbed()
         .setTitle("You Ring?")
          .setColor(0xf24946)
          .setDescription(`Need Help? then do ${prefix}help!`)
    
    message.channel.send(embed2)
  }
  
                                           
  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();  

try{
let commandFile = require(`./commands/${command}.js`);
 commandFile.run(client, message, args);
if(!commandFile) return;
} catch (err) {
}
});
  
   client.on("guildMemberAdd", async member => {
    if (member.guild.id === "464446382162313227") {
           if(member.user.bot){
	
       
          
          let rol = await member.guild.roles.find("name","member")
         await member.removeRole(rol)
           }
        }
   });
}