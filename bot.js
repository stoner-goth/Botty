var Discord = require('discord.io');
var logger = require('winston');
var fs = require('fs')
var auth = require('./auth.json');
var tests = require('./assets/tests/tests.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
var characters = [];
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0].toLowerCase();
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
				break;
			case 'roll':
				var die = Number(args[0]);
				var count = Number(args[1]);
				var i = 0;
				do {
					if (die > 0) {
						var roll = Math.floor(Math.random() * die) + 1;
					}
					else{
						var roll = Math.floor(Math.random() * 100) + 1;
					}
					var mess1 = new String ("**" + user + "** rolled a **" + roll + "**");
					bot.sendMessage({
						to: channelID,
						message: mess1
					});
					i++;
				}
				while (i < count);
				break;
			case 'role':
				if (!args.length){
					bot.sendMessage({
						to: channelID,
						message: "Didn't understand your test you requested :("
					});
					break;
				}
				bot.sendMessage({
						to: channelID,
						message: args[0]
					});
				var role_details=JSON.parse('{"color" : "0xFF0000","hoist" : false,"name" : "'+args[0]+'", "permissions" : ["attachFiles", "sendMessages"],"mentionable": false}');
				bot.sendMessage({
						to: channelID,
						message: role_details
					});
				bot.sendMessage({
						to: channelID,
						message: bot.createRole(bot.id, role_details)
					});
				break;
            // Just add any case commands if you want to..
		}
     }
});