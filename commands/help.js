module.exports = {
    name: 'help',
    description: 'Shows all commands for the bot.',
    aliases: ['helpmenu', 'helpme'],
    async execute(client, message, args, Hyperz, config, con){

        const page = new Hyperz.MessageEmbed()
        .setTitle(`${client.user.username} Help Menu`)
        .setColor(`${config["main_config"].colorhex}`)
        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`, `${config["other_configuration"].serverinvite}`)
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setURL(`https://hyperz.dev/discord`)
        .addFields(
            {name: `What is this?`, value: `${client.user.username} is a Discord bot that will solve all your problems involving time! Have you ever been in a late-night Discord call with your buds, and you don't know what time it is? Well Big Ben here will chime in your channel every 1 hour to help you out!`},
            {name: `Commands:`, value: `\`ping\` - Ping the bot and check latency.\n\`help\` - Show the help section for the bot.\n\`invite\` - Invite the bot to your Discord server.\n\`creator\` - View the creator / coder of this bot.\n\`version\` - View the bots current version.\n\`setchan\` - Sets a channel that the bot will join every hour.\n\`suggest\` - Create a suggestion for Big Benjamin.`},
            {name: `Credits:`, value: `[@aaron5](https://www.tiktok.com/@aaronr5?lang=en) - *Original TikTok Idea.*\n[@Chris](https://twitter.com/groddy12) - *Motivational Support.*\n[@Hyperz](https://hyperz.dev/) - *Physical Programming.*`},
        )
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)
        
        message.channel.send(page).then(msg => {
            msg.delete({ timeout: 30000 })
            message.delete()
        }).catch(e => {if(config["main_config"].debugmode) return console.log(e);});
    }
}
