module.exports = {
    name: 'creator',
    description: 'A Command.',
    aliases: ['credits', 'hyperz'],
    async execute(client, message, args, Hyperz, config, con){

        if(message.channel.type === 'dm') {
            return message.channel.send(`Please use a server channel for commands.`)
        }

        const pingEmbed = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`, `${config["other_configuration"].serverinvite}`)
        .setDescription(`[@aaron5](https://www.tiktok.com/@aaronr5?lang=en) - *Original TikTok Idea.*\n[@Chris](https://twitter.com/groddy12) - *Motivational Support.*\n[@Hyperz](https://hyperz.dev/) - *Physical Programming.*`)
        .setTimestamp()
        .setFooter(`${config["main_config"].copyright}`)
        
        message.channel.send(pingEmbed).then(msg => msg.delete({ timeout: 10000 })).catch(e => {if(config["main_config"].debugmode) return console.log(e);});
        message.delete().catch(e => {if(config["main_config"].debugmode) return console.log(e);});
    },
}