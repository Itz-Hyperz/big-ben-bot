module.exports = {
    name: 'invite',
    description: 'A command.',
    aliases: ['inv'],
    async execute(client, message, args, Hyperz, config, con){
        const pingEmbed = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`, `${config["other_configuration"].serverinvite}`)
        .setDescription(`[Bot Invite](https://discord.com/oauth2/authorize?client_id=855971238035324938&permissions=8&scope=bot)\n[Upvote Bot](https://disbot.top/bot/855971238035324938)\n[Support Server](https://hyperz.dev/discord)`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)
        
        message.channel.send(pingEmbed).then(msg => msg.delete({ timeout: 10000 })).catch(e => {if(config["main_config"].debugmode) return console.log(e);});
        message.delete().catch(e => {if(config["main_config"].debugmode) return console.log(e);});
    },
}
