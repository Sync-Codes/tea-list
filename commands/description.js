const Discord = require("discord.js");
const db = require("quick.db")
exports.run = ( client, message, args) => {
  let msg = args.join(" ")
  if(!msg)return message.channel.send("Please supply an description!")
  
  db.set(`desc_${message.author.id}`, msg)
  let embed = new Discord.RichEmbed()
  .setColor("RED")
  .setDescription(`You just set your Description to\n${msg}`)
  .setTimestamp()
  .setFooter(`Do t!info`)
  message.channel.send(embed)
}