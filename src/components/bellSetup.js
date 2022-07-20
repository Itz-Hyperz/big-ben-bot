const moment = require('moment');
const { getVoiceConnection } = require('@discordjs/voice');

const timestart = "00"; // Minute marker for joining
const timeend = "01"; // Minute marker for leaving

module.exports = async function(client, con) {
    let datetime = moment().format(client.config.date_format).split(':')[1];
    if(datetime == timeend) {
        await con.query(`SELECT * FROM guilds`, async function(err, guilds) {
            if(err) throw err;
            await guilds.forEach(async function(guild) {
                if(guild.channel != "none") {
                    let connection = await getVoiceConnection(guild.guildid);
                    if(connection) {
                        await connection.destroy();
                    };
                };
            });
        });
        return;
    };
    if(datetime != timestart) return;
    await con.query(`SELECT * FROM guilds`, async function(err, guilds) {
        if(err) throw err;
        await guilds.forEach(async function(guild) {
            if(guild.channel != "none") {
                let channel = await client.channels.cache.get(guild.channel);
                if(!channel) {
                    await con.query(`UPDATE guilds SET channel="none" WHERE guildid="${guild.guildid}"`, async (err, row) => { if(err) throw err; });
                } else {
                    if(channel.type != "GUILD_VOICE") {
                        await con.query(`UPDATE guilds SET channel="none" WHERE guildid="${guild.guildid}"`, async (err, row) => { if(err) throw err; });
                    } else {
                        if(channel.joinable && channel.members.size > 0) {
                            require('./bellPlay.js')(channel);
                        };
                    };
                };
            };
        });
    });
};