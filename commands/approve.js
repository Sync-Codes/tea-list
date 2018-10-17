const db = require('quick.db');
const Discord = require("discord.js");
let devs = ["338192747754160138","364007557045551106","297096161842429963"]
module.exports.run = async (client, message, args) => {
  const che = client.emojis.find("name","kCheck")
  const chh = client.emojis.find("name","kParty")
     let embed = new Discord.RichEmbed()
  .setTitle("Evaluation")
  .setDescription("Sorry, the `website` commands can only be executed by Tea Cup.")
  .setColor("#cdf785");
   if (!devs.includes(message.author.id)) return message.channel.send(embed); 
  
  let user = args.join(" ")
    client.fetchUser(user).then(async e =>{
   
      
   
  let embed2 = new Discord.RichEmbed()
  .setTitle("New Staff")
 .setColor(0x36393e)
  .addField("You are now an staff member!","Please refer to <#483095738809581570> For info and regulations.")
  e.send(embed2)
 message.channel.send("Done!")
  
    
                 let role = message.guild.roles.find(`name`, "Server Moderator");
  let channel =message.guild.channels.find(`name`,`mod-announcements`)
  channel.send(`New Mod ${e}`)
       console.log(e)
  let chh = client.channels.get("491972573517709314")
  chh.send(`HEY DO t!staff ${e} THXS ❤`)
      

  })
}