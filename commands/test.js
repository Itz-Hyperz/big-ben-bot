module.exports = {
    name: 'test',
    description: 'Pings the bot.',
    aliases: ['debug', 'demo'],
    async execute(client, message, args, Hyperz, config, con){

        if(message.channel.type === 'dm') {
            return message.channel.send(`Please use a server channel for commands.`)
        }

        const pingEmbed = new Hyperz.MessageEmbed()
        .setColor(config["main_config"].colorhex)
        .setThumbnail(`${client.user.avatarURL({ dynamic: true })}`)
        .setAuthor(`Testing Process`)
        .setDescription(`The bot should join your channel shortly. Notice these things:\n\n- Should play 3 bongs\n- Should be high quality audio\n- Should not re-join if forcefully removed`)
        .setTimestamp()
        .setFooter(`${config.main_config.copyright}`)

        try {
            await con.query(`SELECT * FROM guilds WHERE id='${message.guild.id}'`, async (err, rows) => {
                if(err) throw err;

                for(let data of rows) {
                    if(data.chan != 'none') {
                        try {

                            var bigdogstatus;
                            bigdogstatus = await client.channels.cache.get(data.chan)

                            if(bigdogstatus != undefined) {
                                try {

                                        if(bigdogstatus.type === 'dm') {
                                            await con.query(`UPDATE guilds SET chan='none' WHERE id='${data.id}'`, async (err, row) => {
                                                if(err) throw err;
                                            });
                                        } else {

                                            message.channel.send(pingEmbed).then(msg => msg.delete({ timeout: 12000 })).catch(e => {if(config["main_config"].debugmode) return console.log(e);});

                                            await bigdogstatus.join().then(async connection => {
                                                const dispatcher = await connection.play(require("path").join(__dirname, '../util/audio/test.ogg'));
                                                dispatcher.on("finish", async finish => {
                                                    try {
                                                        await connection.disconnect();
                                                        await bigdogstatus.leave();
                                                    } catch(e) {
                                                        if(config.main_config.debugmode) return console.log(e);
                                                    }
                                                });
                                            }).catch(err => console.log(err));

                                        }
                                } catch(e) {
                                    if(config.main_config.debugmode) return console.log(e);
                                }
                            } else {
                                await con.query(`UPDATE guilds SET chan='none' WHERE id='${data.id}'`, async (err, row) => {
                                    if(err) throw err;
                                });
                                console.log(`\n\n-----------------------\n${data.chan} from ${data.guild} was marked as undefined.\n-----------------------\n\n`)
                            }
                        
                        } catch(e) {
                            if(config.main_config.debugmode) return console.log(e);
                        }
                    } else {
                        return message.channel.send(`You have not defined a channel for me to join. Run the \`b!setchan\` command.`).then(msg => {
                            msg.delete({ timeout: 12000 })
                            message.delete()
                        }).catch(e => {});
                    }
                }

            });

        } catch(e) {
            if(config.main_config.debugmode) return console.log(e);
        }

        message.delete().catch(e => {if(config["main_config"].debugmode) return console.log(e);});
    },
}
