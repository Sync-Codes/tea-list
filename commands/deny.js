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
 let reason = message.content.split(" ").slice(2).join(" ");
  client.fetchUser(user).then(async e =>{
    let embed = new Discord.RichEmbed()
    .setTitle("Sorry.")
    .setColor("GREEN")
    .addField("Sorry your application was Denied **__Reason:__**",reason)
    e.send(embed)
  })
  
}