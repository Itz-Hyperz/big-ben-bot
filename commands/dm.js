module.exports = {
    name: 'dm',
    description: 'Message a user via the bot.',
    aliases: ['message'],
    async execute(client, message, args, Hyperz, config, con){

        try {

            if(message.channel.type === 'dm') {
                return message.channel.send(`Please use a server channel for commands.`)
            }

            if(!args[0]) return message.channel.send(`Please include a user to message in your command.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {});

            if(!args[1]) return message.channel.send(`Please include a message for this user.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {});

            var foundmember;

            if(message.mentions.users.first()) {
                foundmember = client.users.fetch(message.mentions.users.first().id)
            } else if(!isNaN(args[0])) {
                foundmember = client.users.fetch(args[0])
            }

            if(foundmember == undefined) return message.channel.send(`I was unable to find that user.`).then(msg => {
                msg.delete({ timeout: 12000 })
                message.delete()
            }).catch(e => {});

            const mail = new Hyperz.MessageEmbed()
            .setColor(config["main_config"].colorhex)
            .setTitle(`📬 You've Got Mail!`)
            .setDescription(`${args.slice(0).join(" ")}`)
            .setTimestamp()
            .setFooter(`${config.main_config.copyright}`)
            try { mail.setThumbnail(`${client.user.avatarURL({ dynamic: true })}`) } catch(e) {}

            try {
                await foundmember.send(mail).then(async letter => {
                    await message.channel.send(`I have successfully messaged the user.`)
                }).catch(e => {});
            } catch(e) {
                if(config.main_config.debugmode) return console.log(e);
            }
            
        } catch(e) {
            if(config.main_config.debugmode) return console.log(e);
        }
    },
}