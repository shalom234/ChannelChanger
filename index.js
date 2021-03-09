const Discord = require("discord.js");
const bot = new Discord.Client();


const PREFIX = '/';

bot.on('ready', () => {
    console.log("Bot enabled");
});

const COLOR = "#0000FF"

sendEmbed = function(title, caption, channel) {
    var embed = new Discord.RichEmbed()
    .setTitle(title)
    .setDescription(caption)
    .setColor(COLOR)

    channel.send(embed);
}

const onMessage = async function(message) {
    if(message.content[0] == PREFIX) {
        let args = message.content.substring(PREFIX.length).split(" ");
        
        var thisChannel = message.channel;
        var guild = thisChannel.guild;
        var clientMember = guild.me;

        switch(args[0]) {
            case 'getperms':
                var perms = clientMember.permissions;
                var permsObject = perms.serialize();
                var permsString = JSON.stringify(permsObject);
                
                permsString = permsString.replace("{", "")
                permsString = permsString.replace("}", "")

                var newString = ""
                for (var i = 0; i < permsString.length; i++) {
                    var char = permsString.charAt(i);
                    if (char == ",") {
                        newString = newString.concat(", \n");
                    } else {
                       newString = newString.concat(char); 
                    }
                }
                permsString = newString;
                if (perms.hasPermissions("SEND_MESSAGES")) {
                    sendEmbed("Bot Permissions", permsString, thisChannel);
                }
                break;
            case 'credits':
                sendEmbed("Credits", "Made by the DubTaker with Discord.js", thisChannel);
                break;
            case 'help':
                var thisChannel = message.channel;
                var commands = [
                    "help",
                    "credits",
                    "getperms",
                    "nickcall \"call name\" \"nickname\""
                ]

                var commandString = ""
                for (var i = 0; i < commands.length; i++) {
                    commandString = commandString + "\n\t" + PREFIX + commands[i]
                }

                sendEmbed("Commands", commandString, thisChannel);
                break;
            case 'nickcall': 
                var callname = ""
                var nickname = ""    
                
                // capture string arguments
                var quoteIndex = 0;
                for (var i = 0; i < message.content.length; i++) {
                    var c = message.content[i];
                    if (c == "\"") {
                        quoteIndex++;
                    } else {
                        switch(quoteIndex) {
                            case 1: 
                                callname += c;
                                break;
                            case 3:
                                nickname += c;
                                break;
                        }
                    }
                }

                if (quoteIndex != 4) {
                    thisChannel.send("Null Arguments Given (Make sure your channel name and nickname are wrapped in quotations!) ");
                } else { // correct arguments given
                    var channelManager = guild.channels;
                    var targetChannel = channelManager.find(channel => channel.name == callname);
                    if (targetChannel) {
                        var members = targetChannel.members.array();
                        for (var i = 0; i < members.length; i++) {
                            var m = members[i];
                            try {
                                m.setNickname(nickname);
                            } catch(e) {
                                sendEmbed("Cannot manage " + m.user.username + "'s nickname")
                                return console.log(m.user.username + " is unmanageable");
                            }
                        }
                    }
                }
                
                break;
        }
    }
}

bot.on("message", message=>onMessage(message));
bot.login(process.env.token);
