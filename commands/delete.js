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
  
  let id = args.join(" ")
  client.db.delete(id);
  message.channel.send("Deleted: "+ id)
}