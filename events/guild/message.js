const fs = require('fs');
const config = require('../../config.json');

module.exports = (client, Hyperz, config, con, message) =>{
    const prefix = config["main_config"].prefix;
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases.includes(cmd));

    if(command) command.execute(client, message, args, Hyperz, config, con)
}