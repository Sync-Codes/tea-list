const db = require('quick.db');
const Discord = require("discord.js");
let devs = ["338192747754160138"]
let server = ["453600107191861271"]
module.exports.run = async (client, message, args) => {
  const che = client.emojis.find("name","kCheck")
  const chh = client.emojis.find("name","kParty")
     let embed = new Discord.RichEmbed()
  .setTitle("Evaluation")
  .setDescription("Sorry, the `website` commands can only be executed by Tea Cup.")
  .setColor("#cdf785");
   if (!devs.includes(message.author.id)) return message.channel.send(embed); 
  
              let current = client.db.get('staff');
      let mentioned = message.mentions.users.first() 
      let action;
      if (!current) current = [mentioned.id], action = 'added';
      else {
        if (current.includes(mentioned.id)) {
          action = 'removed'
          current.splice(current.indexOf(mentioned.id), 1);
         //   let role = message.guild.roles.find(`name`, "Server Moderator");
  
        } else {
          action = 'added'
           // let role = message.guild.roles.find(`name`, "Server Moderator");
  
          //current.push(mentioned.id);
        }
      }
      client.db.set('staff', current);
      message.channel.send(`**Successfully ${action} ${mentioned.tag} as a website staff member.**`);

}