const fs = require('fs');

module.exports = (client, Hyperz, config, con) =>{
    const commandfiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

    for(const file of commandfiles){
        const command = require(`../commands/${file}`);
        if(command.name){
            client.commands.set(command.name, command);
        } else {
            continue;
        }
    }
}