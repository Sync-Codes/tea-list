const db = require('quick.db');
const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {   
  
    let ga =client.guilds.get('464446382162313227')
    let member = message.author
  let role = message.guild.roles.find("name", "nsfw");
  
   if (ga.members.get(member.id).roles.find('name','updates')) {
     
message.guild.member(message.author.id).removeRole(client.guilds.get(message.guild.id).roles.find('name', 'updates'))
        message.channel.send("You no longer get updates!");
   }else{
     
     message.guild.member(message.author.id).addRole(client.guilds.get(message.guild.id).roles.find('name', 'updates'))
        message.channel.send("You can now get updates!");
   }
  
  
}