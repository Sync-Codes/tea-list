exports.run = (client) => {
  
    var clientonmessage = `
------------------------------------------------------
> Logging in...
------------------------------------------------------
Logged in as ${client.user.tag}
Working on ${client.guilds.size} servers!
${client.channels.size} channels and ${client.users.size} users cached!
I am logged in and ready to roll!
LET'S GO!
------------------------------------------------------
----------Bot created by Tea Cup#3433-----------
------------------------------------------------------
-----------------Bot's commands logs------------------`
    console.log(clientonmessage);
//client.user.setPresence({ game: { name: `The world  🌎`,  type: 2 } });
  
  //DND mode
     function setActivity() {
    //Variable Array for what the setGame can be set to
    var Gameinfo = [`Prefix: t!`, `Serving ${client.users.size} users`, 
        `Ping to API: ${(client.ping).toFixed(0)} Ms` // Change these to what you want, add as many or as few as you want to
    ]

    var info = Gameinfo[Math.floor(Math.random() * Gameinfo.length)]; //Random Math to set the setGame to something in the GameInfo array
let debugMode = "1";
     client.user.setPresence({ game: { name: info } })// "playing Game" '...' Sets the setGame to what the info Random math picked from the GameInfo Array
    if (debugMode === "1") {
        console.log(`[ LOG ] set Activity set to ( ${info} )`) //Logs to console what the setGame was set as.
    }

}


setInterval(setActivity, 1000 * 60 * 2) //sets and picks a new game every 2 minutes
 
 client.user.setStatus("idle")
  

}