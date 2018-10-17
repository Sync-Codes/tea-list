const db = require('quick.db');
const Discord = require("discord.js");
let devs = ["338192747754160138"]
let server = ["453600107191861271"]
module.exports.run = async (client, message, args) => {

 const target = message.mentions.users.first() || message.author
  let e = target
  if(!target)return message.channel.send('**Please mention a user.**');
  let status = `${target} **is an normal member!**`
  let username = target
  if(e.id === "338192747754160138")status = `**${target} is the Creator of Tea List**`
  if(e.id === "364007557045551106")status = `**${username} is a Staff Member**`
  if(e.id === "297096161842429963" )status = `**${username} is a Staff Member**`
  if(e.id === "229086637689274368")status = `**${username} is a Staff Member**`
  let embed = new Discord.RichEmbed()
  .setColor("RED")
  .setAuthor(`${target.username}'s Info`)
  .setURL(`https://tea-list.glitch.me/profile/${target.id}`)
   .setDescription(`${status}\n\nWanna look at there Profile?\n [Click ME!](https://tea-list.glitch.me/profile/${target.id})`)
  .setThumbnail(`${target.avatarURL}`)
  .setTimestamp()
  .setFooter(`Do t!info @user`)
  message.channel.send(embed)
}