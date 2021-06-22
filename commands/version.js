module.exports = {
    name: 'version',
    description: 'A Command.',
    aliases: ['v'],
    async execute(client, message, args, Hyperz, config, con){

        if(message.channel.type === 'dm') {
            return message.channel.send(`Please use a server channel for commands.`)
        }

        const pingEmbed = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`, `${config["other_configuration"].serverinvite}`)
        .setDescription(`**Current Version:** 1.0`)
        .setTimestamp()
        .setFooter(`${config["main_config"].copyright}`)
        
        message.channel.send(pingEmbed).then(msg => msg.delete({ timeout: 10000 })).catch(e => {if(config["main_config"].debugmode) return console.log(e);});
        message.delete().catch(e => {if(config["main_config"].debugmode) return console.log(e);});
    },
}