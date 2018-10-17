const Discord = require("discord.js");

exports.run = ( client, message, args) => {

       if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You need the ADMINISTRATOR permission to run this comamnd!")
 let role = message.guild.roles.find("name","updates")
 let chan =  message.guild.channels.find(`name`,"updates")
chan.send(`${args.join(" ")} ${role}`)
}