module.exports = {
    name: 'alert',
    description: 'Send out an alert.',
    aliases: ['announce'],
    async execute(client, message, args, Hyperz, config, con){

        const array = ['704094587836301392', '759247388606070794']

        array.forEach(async a => {
            if(a === message.author.id) {

                if(!args[0]) return message.channel.send(`Please include an announcement in your message.`).then(msg => {
                    msg.delete({ timeout: 12000 })
                    message.delete()
                }).catch(e => {})

                const embed = new Hyperz.MessageEmbed()
                .setColor(config["main_config"].colorhex)
                .setAuthor(`Notice from ${message.author.tag}`, `${message.author.displayAvatarURL()}`, `${config["other_configuration"].serverinvite}`)
                .setDescription(`${args.join(" ")}`)
                .setTimestamp()
                .setFooter(`${config.main_config.copyright}`)
                try { embed.setThumbnail(`${message.author.avatarURL({ dynamic: true })}`) } catch(e) {}

                con.query(`SELECT * FROM guilds`, async (err, rows) => {
                    if(err) throw err;
                    for(let data of rows) {

                        let channel = await client.channels.cache.get(data.logs)

                        if(channel != 'none') {
                            try {
                                channel.send(embed).catch(e => {});
                            } catch(e) {}
                        }

                    }
                    message.channel.send(`I have posted your announcement in all available channels.`).then(msg => {
                        msg.delete({ timeout: 12000 })
                        message.delete()
                    }).catch(e => {});
                });
            }
        });
    },
}