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
  
          if (!message.mentions.members.first()) return message.channel.send('**Please mention a user.**');
  let mentioned = message.mentions.members.first();
  let id = mentioned.id
   client.db.set('staff', id);
  message.channel.send(`Override Complete: Added ${mentioned} as staff!`)
}