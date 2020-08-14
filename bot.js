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
				var modifier = Number(args[0]);
				var roll = Math.floor(Math.random() * 100) + 1;
				if (modifier > 0) {
					var total = roll + modifier
					var mess2 = new String (". With the modifier, the total is **" + total + "**");
				}
				else{
					var mess2 = new String (". Don't forget to add any modifiers!");
				}
				var mess1 = new String ("**" + user + "** rolled a **" + roll + "**");
				bot.sendMessage({
					to: channelID,
					message: mess1 + mess2
				});
				break;
			case 'load':
				var found = false;
				characters.forEach(element => {
					if (element.playername == user){
						found = true;
						bot.sendMessage({
							to: channelID,
							message: "Your character " + element.name+ " is already loaded!"
						});
					}
				});
				if (!found){
					var file = fs.readFileSync('./assets/character_sheets/'+user+'.json');
					var character = JSON.parse(file);
					bot.sendMessage({
						to: channelID,
						message: character.name
					});
					characters.push(character);
				}
				break;
			case 'test':
				if (!args.length){
					bot.sendMessage({
						to: channelID,
						message: "Didn't understand your test you requested :( please try one of these:"
					});
					break;
				}
				var found = false;
				var net = 0;
				var degrees = 0;
				var skill = 0;
				var tested = "";
				var stat = 0;
				characters.forEach(element => {
					if (element.playername == user){
						found = true;
						var roll = Math.floor(Math.random() * 100) + 1;
						skill = args[0].toLowerCase();
						if (skill == "ws"|| skill == "weapon"|| skill == "wskill"| skill =="weapons"){
							net = element.WS - roll
							stat = element.WS
							tested = "Weapon Skill"
						}
						if (skill == "bs"|| skill == "ballistic"|| skill == "bskill"| skill =="guns" |skill == "gun"){
							net = element.BS - roll
							stat = element.BS
							tested = "Ballistic Skill"
						}
						if (skill == "s"|| skill == "str"|| skill == "strength"){
							net = element.S - roll
							stat = element.S
							tested = "Strength"
						}
						if (skill == "t"|| skill == "tough"|| skill == "toughness"){
							net = element.T - roll
							stat = element.T
							tested = "Toughness"
						}
						if (skill == "ag"|| skill == "agility"|| skill == "dex"|| skill == "dexterity"){
							net = element.AG - roll
							stat = element.AG
							tested = "Agility"
						}
						if (skill == "int"|| skill == "intelligence"|| skill == "smart"|| skill == "smarts"){
							net = element.INT - roll
							stat = element.INT
							tested = "Intelligence"
						}
						if (skill == "per"|| skill == "p"|| skill == "perception"){
							net = element.PER - roll
							stat = element.PER
							tested = "Perception"
						}
						if (skill == "wp"|| skill == "will"|| skill == "willpower"){
							net = element.WP - roll
							stat = element.WP
							tested = "Willpower"
						}
						if (skill == "fel"|| skill == "f"|| skill == "fellowship"|| skill == "charisma"|| skill == "cha"){
							net = element.FEL - roll
							stat = element.FEL
							tested = "Fellowship"
						}
						
						if (skill == "inf"|| skill == "influence"){
							net = element.IFL - roll
							stat = element.IFL
							tested = "Influence"
						}
						if (net > 0){
								degrees = Math.abs(Math.floor(net/10)) + "** degrees of success";
							}
							else{
								degrees = Math.abs(Math.ceil(net/10)) + "** degrees of failure";
							}
						if (stat){
							bot.sendMessage({
							to: channelID,
							message: element.name + "'s " + tested + " test result: \nSkill: " + stat + "\nRolled: " + roll + "\n**Final Result: " + net + "**, meaning **" + degrees
							});
						}
						else{
							bot.sendMessage({
							to: channelID,
							message: "Didn't understand your test you requested :( please try one of these:"
							});
						}
					}
				});
				if (!found){
					bot.sendMessage({
						to: channelID,
						message: "Character not loaded, make sure to run '!load' first!"
					});
				}
				
					
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