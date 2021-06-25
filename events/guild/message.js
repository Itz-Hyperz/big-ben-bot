const fs = require('fs');
const config = require('../../config.json');

module.exports = (client, Hyperz, config, con, message) => {
    
    if(message.author.bot) return;

    const filter = m => m.author.id === message.author.id;
    
    if(message.channel.type === 'dm') {
        return message.channel.send(`You cannot use my DMs, please use a server channel.`).catch(e => {});
    }

    const insults = ['stupid bot', 'dumb bot', 'gay bot', 'retard', 'retarded bot', 'you suck', 'shit bot', 'bad bot', 'shitter'];

    if(message.mentions.users.first()) {
        if(message.mentions.users.first().id === client.user.id) {

            insults.forEach(async i => {
                if(message.content.includes(i)) {
                    message.channel.send(`This you? https://tenor.com/view/shower-cry-cartoon-network-gif-5184213`).then(() => {
                        message.channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] })
                        .then(async collected2 => {
                            let ress = collected2.first().content.toLowerCase()
                            if(ress === 'no') {
                                message.channel.send(`Oh, must have been the wrong one, here, this must be you: https://tenor.com/view/regularshow-gif-5734420`).catch(e => {});
                            }
                        }).catch(e => {});
                    }).catch(e => {});
                }
            });

        }
    }
    
    const prefix = config["main_config"].prefix;
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases.includes(cmd));

    if(command) command.execute(client, message, args, Hyperz, config, con)
}
